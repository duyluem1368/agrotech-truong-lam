#!/usr/bin/env python3
"""Build a compact, source-linked Vietnamese fertilizer price list.

Google News RSS is used as the search index.  We deliberately publish only
prices that are present in a result headline; this keeps the unattended job
from inventing a number or confusing a general market article with a quote.
"""
import email.utils
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
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


previous = load_previous()
found = []
for product in PRODUCTS:
    item = find_product(product) or previous.get(product["name"])
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
    "method": "Tự động tìm kiếm online; chỉ lấy giá có trong tiêu đề nguồn công khai",
    "groups": groups,
}
Path("market-data.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Đã ghi {sum(len(group['items']) for group in groups)} mức giá / {len(groups)} nhóm")
