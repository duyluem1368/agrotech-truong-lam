#!/usr/bin/env python3
"""Build a compact, source-linked Vietnamese fertilizer price list.

Google News RSS is used as the search index.  We deliberately publish only
prices that are present in a result headline; this keeps the unattended job
from inventing a number or confusing a general market article with a quote.
"""
import email.utils
import html as html_lib
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

PRODUCTS = [
    {"group": "Phân Urê", "name": "Urê Cà Mau", "aliases": ("urê cà mau", "ure cà mau")},
    {"group": "Phân Urê", "name": "Urê Phú Mỹ", "aliases": ("urê phú mỹ", "ure phú mỹ")},
    {"group": "Phân Urê", "name": "Urê Hà Bắc", "aliases": ("urê hà bắc", "ure hà bắc")},
    {"group": "Phân NPK", "name": "NPK 20-20-15 Đầu Trâu", "aliases": ("npk 20-20-15 đầu trâu",)},
    {"group": "Phân NPK", "name": "NPK 20-20-15 Bình Điền", "aliases": ("npk 20-20-15 bình điền",)},
    {"group": "Phân NPK", "name": "NPK 16-16-8", "aliases": ("npk 16-16-8",)},
    {"group": "Phân Kali và Lân", "name": "Kali bột", "aliases": ("kali bột",)},
    {"group": "Phân Kali và Lân", "name": "Lân Lâm Thao", "aliases": ("lân lâm thao",)},
    {"group": "Phân Kali và Lân", "name": "DAP", "aliases": ("dap",)},
]

PRICE_RE = re.compile(
    r"(?P<low>\d{1,3}(?:[.\s]\d{3})+)\s*(?:đ|đồng)?"
    r"(?:\s*[-–—]\s*(?P<high>\d{1,3}(?:[.\s]\d{3})+)\s*(?:đ|đồng)?)?"
    r"\s*(?:/\s*)?(?P<unit>bao|kg|tấn|chai|gói|lít)?",
    re.I,
)

DAILY_PRICE_URL = "https://banggianongsan.com/bang-gia-phan-bon-hom-nay/"


class TableParser(HTMLParser):
    """Collect simple table rows without adding a third-party dependency."""

    def __init__(self):
        super().__init__()
        self.in_cell = False
        self.cell = []
        self.row = []
        self.rows = []

    def handle_starttag(self, tag, attrs):
        if tag in ("td", "th"):
            self.in_cell = True
            self.cell = []

    def handle_data(self, data):
        if self.in_cell:
            self.cell.append(data)

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.in_cell:
            self.row.append(re.sub(r"\s+", " ", "".join(self.cell)).strip())
            self.in_cell = False
        elif tag == "tr":
            if len(self.row) >= 3:
                self.rows.append(self.row[:3])
            self.row = []


def price_numbers(text):
    values = []
    for value in re.findall(r"\d{1,3}(?:[.\s]\d{3})+", text):
        number = int(re.sub(r"\D", "", value))
        if 100_000 <= number <= 5_000_000:
            values.append(number)
    return values


def daily_match(product, kind, brand):
    """Match the site's table vocabulary to the names used on our page."""
    kind, brand = normalise(kind), normalise(brand)
    name = normalise(product["name"])
    if name == "urê cà mau":
        return "urê" in kind and "cà mau" in brand
    if name == "urê phú mỹ":
        return "urê" in kind and "phú mỹ" in brand
    if name == "urê hà bắc":
        return "urê" in kind and "hà bắc" in brand
    if name == "npk 20-20-15 đầu trâu":
        return "npk 20-20-15" in kind and "đầu trâu" in brand
    if name == "npk 20-20-15 bình điền":
        return "npk 20-20-15" in kind and "bình điền" in brand
    if name == "npk 16-16-8":
        return kind in ("npk 16-16-8", "phân npk 16-16-8")
    if name == "kali bột":
        return "kali bột" in kind
    if name == "lân lâm thao":
        return "lân" in kind and "lâm thao" in brand
    if name == "dap":
        return "dap" in kind
    return False


def fetch_daily_prices():
    """Read the current dated price tables, including prices buried in article body."""
    request = urllib.request.Request(DAILY_PRICE_URL, headers={"User-Agent": "AgrotechTruongLam/3.0"})
    html = urllib.request.urlopen(request, timeout=30).read().decode("utf-8", "replace")
    date_match = re.search(r"Bảng giá phân Bón mới nhất\s*-\s*(\d{1,2})/(\d{1,2})/(\d{4})", html, re.I)
    if not date_match:
        raise ValueError("Nguồn bảng giá không có ngày công bố")
    day, month, year = map(int, date_match.groups())
    price_date = f"{year:04d}-{month:02d}-{day:02d}"
    parser = TableParser()
    parser.feed(html)
    items = {}
    for product in PRODUCTS:
        values = []
        for kind, brand, price in parser.rows:
            if daily_match(product, kind, brand):
                values.extend(price_numbers(price))
        if not values:
            continue
        low, high = min(values), max(values)
        low_text = f"{low:,}".replace(",", ".")
        high_text = f"{high:,}".replace(",", ".")
        price_text = f"{low_text} đồng/bao" if low == high else f"{low_text} – {high_text} đồng/bao"
        items[product["name"]] = {
            "name": product["name"],
            "price": price_text,
            "detail": "Giá tham khảo tổng hợp theo khu vực và thương hiệu",
            "source": "Bảng Giá Nông Sản",
            "date": price_date,
            "url": DAILY_PRICE_URL,
            "sourceTitle": f"Bảng giá phân bón mới nhất ngày {day:02d}/{month:02d}/{year}",
        }
    return items


def search(query):
    params = {"q": query, "hl": "vi", "gl": "VN", "ceid": "VN:vi"}
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode(params)
    request = urllib.request.Request(url, headers={"User-Agent": "AgrotechTruongLam/2.0"})
    return ET.fromstring(urllib.request.urlopen(request, timeout=30).read()).findall(".//item")


def normalise(text):
    return re.sub(r"\s+", " ", text.lower().replace("–", "-").replace("—", "-")).strip()


def extract_price(title):
    matches = []
    for match in PRICE_RE.finditer(title):
        low = int(re.sub(r"\D", "", match.group("low")))
        high = int(re.sub(r"\D", "", match.group("high") or "")) if match.group("high") else None
        # Ignore dates, percentages and business figures that are not retail bag prices.
        if low < 100_000 or low > 5_000_000 or (high and (high < low or high > 5_000_000)):
            continue
        unit = (match.group("unit") or "bao").lower()
        low_text = f"{low:,}".replace(",", ".")
        if high:
            high_text = f"{high:,}".replace(",", ".")
            matches.append(f"{low_text} – {high_text} đồng/{unit}")
        else:
            matches.append(f"{low_text} đồng/{unit}")
    return matches[0] if matches else ""


def parse_result(node, product):
    raw_title = (node.findtext("title") or "").strip()
    link = (node.findtext("link") or "").strip()
    if not raw_title or not link:
        return None
    parts = raw_title.rsplit(" - ", 1)
    title = parts[0].strip()
    source = parts[1].strip() if len(parts) == 2 else "Nguồn báo chí"
    text = normalise(title)
    if not any(alias in text for alias in product["aliases"]):
        return None
    price = extract_price(title)
    if not price:
        return None
    try:
        published = email.utils.parsedate_to_datetime(node.findtext("pubDate") or "").astimezone(timezone.utc)
    except Exception:
        return None
    return {
        "name": product["name"],
        "price": price,
        "detail": "Giá tham khảo theo bài đăng mới nhất tìm thấy",
        "source": source,
        "date": published.date().isoformat(),
        "url": link,
        "sourceTitle": title,
    }


def find_product(product):
    query = f'"{product["name"]}" giá đồng bao phân bón'
    candidates = []
    try:
        for node in search(query):
            item = parse_result(node, product)
            if item:
                candidates.append(item)
    except Exception as exc:
        print(f"Không tìm được {product['name']}: {exc}")
    return max(candidates, key=lambda item: item["date"], default=None)


def load_previous():
    try:
        data = json.loads(Path("market-data.json").read_text(encoding="utf-8"))
        return {item["name"]: item for group in data.get("groups", []) for item in group.get("items", [])}
    except Exception:
        return {}


def render_price_page(payload):
    """Build an indexable HTML landing page from the same verified price data."""
    all_items = [item for group in payload["groups"] for item in group["items"]]
    source_date = max((item["date"] for item in all_items), default=datetime.now(timezone.utc).date().isoformat())
    year, month, day = source_date.split("-")
    display_date = f"{day}/{month}/{year}"
    rows = []
    position = 0
    schema_items = []
    for group in payload["groups"]:
        rows.append(f'<tr class="group"><th colspan="4">{html_lib.escape(group["name"])}</th></tr>')
        for item in group["items"]:
            position += 1
            rows.append(
                "<tr>"
                f'<td><strong>{html_lib.escape(item["name"])}</strong></td>'
                f'<td class="price">{html_lib.escape(item["price"])}</td>'
                f'<td><time datetime="{html_lib.escape(item["date"])}">{display_date}</time></td>'
                f'<td><a href="{html_lib.escape(item["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{html_lib.escape(item["source"])} ↗</a></td>'
                "</tr>"
            )
            schema_items.append({
                "@type": "ListItem",
                "position": position,
                "name": item["name"],
                "description": f'{item["name"]}: {item["price"]}, cập nhật {display_date}',
                "url": f'https://agrotechtruonglam.com.vn/gia-phan-bon-hom-nay/#{urllib.parse.quote(item["name"].lower().replace(" ", "-"))}',
            })
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Dataset",
                "name": f"Bảng giá phân bón hôm nay {display_date}",
                "description": "Giá tham khảo phân Urê, NPK, Kali, Lân và DAP được tổng hợp tự động từ nguồn công khai.",
                "url": "https://agrotechtruonglam.com.vn/gia-phan-bon-hom-nay/",
                "dateModified": source_date,
                "inLanguage": "vi-VN",
                "creator": {"@type": "Organization", "name": "Công ty TNHH Agrotech Trường Lâm"},
                "isBasedOn": sorted({item["url"] for item in all_items}),
            },
            {"@type": "ItemList", "name": "Giá các loại phân bón", "numberOfItems": len(schema_items), "itemListElement": schema_items},
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": "Giá phân bón hôm nay được cập nhật khi nào?", "acceptedAnswer": {"@type": "Answer", "text": "Bảng giá được hệ thống kiểm tra và cập nhật tự động mỗi ngày từ nguồn công khai, kèm ngày và liên kết để đối chiếu."}},
                    {"@type": "Question", "name": "Giá phân bón có giống nhau ở mọi khu vực không?", "acceptedAnswer": {"@type": "Answer", "text": "Không. Giá thực tế có thể khác theo khu vực, đại lý, thương hiệu, quy cách bao bì và thời điểm mua."}},
                ],
            },
        ],
    }
    page = f'''<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#064b36">
  <title>Giá phân bón hôm nay {display_date}: Urê, NPK, DAP, Kali</title>
  <meta name="description" content="Bảng giá phân bón hôm nay {display_date}: Urê Cà Mau, Phú Mỹ, Hà Bắc, NPK, DAP, Kali và Lân. Giá theo bao, có nguồn đối chiếu và cập nhật mỗi ngày.">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="https://agrotechtruonglam.com.vn/gia-phan-bon-hom-nay/">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:site_name" content="Agrotech Trường Lâm">
  <meta property="og:title" content="Giá phân bón hôm nay {display_date}">
  <meta property="og:description" content="Cập nhật giá Urê, NPK, DAP, Kali và Lân mới nhất, có nguồn kiểm chứng.">
  <meta property="og:url" content="https://agrotechtruonglam.com.vn/gia-phan-bon-hom-nay/">
  <script type="application/ld+json">{json.dumps(schema, ensure_ascii=False).replace('</', '<\\/')}</script>
  <style>
    :root{{--green:#064b36;--light:#eef7f1;--gold:#d9a928;--ink:#18332a}}*{{box-sizing:border-box}}body{{margin:0;color:var(--ink);font-family:Arial,sans-serif;line-height:1.55;background:#fafcfb}}header{{background:var(--green);color:#fff;padding:18px max(5vw,20px);display:flex;align-items:center;justify-content:space-between;gap:20px}}header a{{color:#fff;text-decoration:none}}header strong{{font-size:20px}}nav a{{margin-left:18px}}main{{max-width:1120px;margin:auto;padding:42px 20px 70px}}.crumbs{{font-size:14px;margin-bottom:24px}}.crumbs a,.source a,a{{color:#08704f}}h1{{font-size:clamp(32px,5vw,54px);line-height:1.12;margin:0 0 16px}}.lead{{font-size:18px;max-width:800px}}.status{{display:inline-flex;gap:8px;align-items:center;background:var(--light);padding:10px 14px;border-radius:999px;font-weight:700}}.dot{{width:9px;height:9px;border-radius:50%;background:#20a86b}}.table-wrap{{overflow:auto;background:#fff;border:1px solid #dce9e1;border-radius:16px;margin:28px 0;box-shadow:0 12px 35px #113d2810}}table{{width:100%;border-collapse:collapse;min-width:720px}}th,td{{padding:15px 18px;text-align:left;border-bottom:1px solid #e7eee9}}thead th{{background:#123d2f;color:#fff}}tr.group th{{background:var(--light);color:var(--green);font-size:18px}}td.price{{font-weight:800;color:#9d4b08}}.note,.content{{background:#fff;border:1px solid #dce9e1;border-radius:14px;padding:22px;margin-top:24px}}h2{{margin-top:38px}}.cta{{display:inline-block;background:var(--gold);color:#172b21;padding:12px 18px;border-radius:9px;text-decoration:none;font-weight:800}}footer{{background:#102f25;color:#dce9e1;padding:28px 20px;text-align:center}}@media(max-width:680px){{header nav{{display:none}}main{{padding-top:28px}}}}
  </style>
</head>
<body>
  <header><a href="/"><strong>AGROTECH TRƯỜNG LÂM</strong></a><nav><a href="/">Trang chủ</a><a href="/#san-pham">Sản phẩm</a><a href="tel:0388051282">Tư vấn: 0388 051 282</a></nav></header>
  <main>
    <div class="crumbs"><a href="/">Trang chủ</a> › Giá phân bón hôm nay</div>
    <div class="status"><span class="dot"></span> Dữ liệu mới nhất: {display_date}</div>
    <h1>Giá phân bón hôm nay {display_date}</h1>
    <p class="lead">Cập nhật giá tham khảo các loại phân Urê, NPK, DAP, Kali và Lân phổ biến trên thị trường. Mỗi mức giá đều kèm nguồn công khai để người đọc kiểm tra trực tiếp.</p>
    <div class="table-wrap"><table><thead><tr><th>Loại phân bón</th><th>Giá tham khảo</th><th>Ngày giá</th><th>Nguồn</th></tr></thead><tbody>{''.join(rows)}</tbody></table></div>
    <p class="note"><strong>Lưu ý:</strong> Giá có thể chênh lệch theo khu vực, đại lý, thương hiệu, chi phí vận chuyển và quy cách đóng gói. Hãy liên hệ điểm bán tại địa phương trước khi giao dịch.</p>
    <section class="content"><h2>Cách đọc bảng giá phân bón</h2><p>Các khoảng giá thể hiện mức thấp nhất và cao nhất tìm thấy trong bảng nguồn theo khu vực hoặc thương hiệu. DAP và NPK thường có biên độ rộng do khác nhà sản xuất và hàm lượng dinh dưỡng.</p><h2>Bảng giá được cập nhật như thế nào?</h2><p>Hệ thống Agrotech Trường Lâm kiểm tra nguồn công khai mỗi sáng, đọc giá trong nội dung bảng và ghi lại ngày nguồn công bố. Khi nguồn chính gặp lỗi, hệ thống dùng kết quả tìm kiếm tin tức làm phương án dự phòng, không tự suy đoán giá.</p><h2>Cần báo giá tại khu vực của Sếp?</h2><p>Gọi trực tiếp để được hỗ trợ đối chiếu loại phân, quy cách bao và giá tại khu vực.</p><a class="cta" href="tel:0388051282">Gọi 0388 051 282</a></section>
  </main>
  <footer>© {year} Công ty TNHH Agrotech Trường Lâm · MST 0111231570 · Hà Nội</footer>
</body>
</html>'''
    target = Path("gia-phan-bon-hom-nay/index.html")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(page, encoding="utf-8")
    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://agrotechtruonglam.com.vn/</loc>
    <lastmod>{source_date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://agrotechtruonglam.com.vn/gia-phan-bon-hom-nay/</loc>
    <lastmod>{source_date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
'''
    Path("sitemap.xml").write_text(sitemap, encoding="utf-8")


previous = load_previous()
try:
    daily = fetch_daily_prices()
except Exception as exc:
    print(f"Không đọc được bảng giá theo ngày: {exc}")
    daily = {}
found = []
for product in PRODUCTS:
    # Prefer the dated full table; Google News remains a fallback for outages.
    item = daily.get(product["name"]) or find_product(product) or previous.get(product["name"])
    if item:
        found.append((product["group"], item))

groups = []
for group_name in dict.fromkeys(product["group"] for product in PRODUCTS):
    rows = [item for group, item in found if group == group_name]
    if rows:
        groups.append({"name": group_name, "items": rows})

# Never replace a useful published list with an empty result after a temporary
# network/search failure.
if not groups and previous:
    raise SystemExit("Không có kết quả mới; giữ nguyên market-data.json")

payload = {
    "updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    "method": "Tự động tìm kiếm online; ưu tiên bảng giá theo ngày và giữ liên kết nguồn công khai",
    "groups": groups,
}
Path("market-data.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
render_price_page(payload)
print(f"Đã ghi {sum(len(group['items']) for group in groups)} mức giá / {len(groups)} nhóm")
