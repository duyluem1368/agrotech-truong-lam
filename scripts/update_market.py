#!/usr/bin/env python3
"""Build a transparent daily feed of Vietnamese agricultural input price reports."""
import email.utils
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

QUERIES = {
    "fertilizer": ["giá phân bón hôm nay Việt Nam Urê DAP Kali NPK", "thị trường phân bón Việt Nam giá mới nhất"],
    "pesticide": ["giá thuốc bảo vệ thực vật Việt Nam", "thị trường thuốc bảo vệ thực vật giá"],
    "seed": ["giá giống lúa hôm nay", "giá hạt giống cây trồng Việt Nam"],
}

def fetch(query):
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": query, "hl": "vi", "gl": "VN", "ceid": "VN:vi"})
    request = urllib.request.Request(url, headers={"User-Agent": "AgrotechTruongLam/1.0"})
    return ET.fromstring(urllib.request.urlopen(request, timeout=30).read())

def trend(title):
    text = title.lower()
    if any(word in text for word in ("tăng", "neo cao", "lập đỉnh")): return "up"
    if any(word in text for word in ("giảm", "hạ nhiệt", "đi xuống")): return "down"
    return "stable"

def price_text(title):
    patterns = [r"\b\d{1,3}(?:[.,]\d{3})+(?:\s*(?:đồng|triệu)(?:/\w+)?)", r"\b\d+(?:[.,]\d+)?\s*triệu/bao"]
    found = []
    for pattern in patterns:
        found.extend(re.findall(pattern, title, flags=re.I))
    return " · ".join(dict.fromkeys(found))

def describe(category):
    return {
        "fertilizer": "Bản tin giá hoặc diễn biến thị trường Urê, DAP, Kali, NPK và các nhóm phân bón chính.",
        "pesticide": "Thông tin thị trường thuốc bảo vệ thực vật; cần đối chiếu hoạt chất, quy cách và đại lý tại địa phương.",
        "seed": "Thông tin giá giống cây trồng; cần đối chiếu giống, cấp xác nhận, vụ sản xuất và khu vực cung ứng.",
    }[category]

def relevant(category, title):
    text = title.lower()
    if not re.search(r"(?<!\w)giá(?!\w)", text):
        return False
    if category == "fertilizer":
        return any(term in text for term in ("giá phân bón", "bảng giá", "giá urê", "giá ure", "giá dap", "giá kali", "giá npk"))
    if category == "pesticide":
        return any(term in text for term in ("giá thuốc bảo vệ thực vật", "giá thuốc bvtv", "giá thuốc trừ sâu", "giá thuốc trừ bệnh"))
    return any(term in text for term in ("giá giống", "giá hạt giống"))

items = {}
for category, queries in QUERIES.items():
    for query in queries:
        try:
            nodes = fetch(query).findall(".//item")
        except Exception as exc:
            print(f"Skip {query}: {exc}")
            continue
        for node in nodes[:15]:
            raw_title = (node.findtext("title") or "").strip()
            url = (node.findtext("link") or "").strip()
            if not raw_title or not url: continue
            parts = raw_title.rsplit(" - ", 1)
            title = parts[0].strip()
            source = parts[1].strip() if len(parts) == 2 else "Nguồn báo chí"
            if not relevant(category, title): continue
            try:
                date = email.utils.parsedate_to_datetime(node.findtext("pubDate") or "").astimezone(timezone.utc)
            except Exception:
                continue
            key = re.sub(r"\W+", " ", title.lower()).strip()
            items[key] = {"category": category, "title": title, "source": source, "date": date.date().isoformat(), "url": url, "trend": trend(title), "price": price_text(title), "summary": describe(category)}

ordered = sorted(items.values(), key=lambda item: item["date"], reverse=True)
selected = []
for category in QUERIES:
    selected.extend([item for item in ordered if item["category"] == category][:3])
selected = sorted(selected, key=lambda item: item["date"], reverse=True)[:9]
payload = {"updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"), "items": selected}
Path("market-data.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {len(selected)} market items")
