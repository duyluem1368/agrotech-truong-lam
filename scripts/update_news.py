#!/usr/bin/env python3
"""Build the site's current Vietnamese crop-pest news feed without dependencies."""
import email.utils
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

QUERIES = [
    "dự báo sâu bệnh hại cây trồng",
    "cảnh báo sâu bệnh hại lúa Việt Nam",
    "sinh vật gây hại cây trồng phòng trừ",
]

def summary(title):
    text = title.lower()
    if "lúa" in text:
        return "Bản tin liên quan đến dịch hại trên lúa. Cần tăng tần suất thăm đồng, kiểm tra theo giai đoạn sinh trưởng và hướng dẫn tại địa phương."
    if "cây ăn quả" in text or "cây công nghiệp" in text:
        return "Thông tin cảnh báo trên nhóm cây lâu năm. Chú ý điều kiện mưa ẩm, vệ sinh vườn và nhận diện đúng triệu chứng trước khi xử lý."
    return "Thông tin dự tính, cảnh báo hoặc hướng dẫn phòng trừ mới. Mở nguồn gốc để kiểm tra địa bàn, thời gian và đối tượng cụ thể."

def fetch(query):
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({
        "q": query, "hl": "vi", "gl": "VN", "ceid": "VN:vi"
    })
    request = urllib.request.Request(url, headers={"User-Agent": "AgrotechTruongLam/1.0"})
    return ET.fromstring(urllib.request.urlopen(request, timeout=30).read())

items = {}
for query in QUERIES:
    for node in fetch(query).findall(".//item"):
        raw_title = (node.findtext("title") or "").strip()
        url = (node.findtext("link") or "").strip()
        raw_date = node.findtext("pubDate") or ""
        if not raw_title or not url:
            continue
        parts = raw_title.rsplit(" - ", 1)
        title = parts[0].strip()
        source = parts[1].strip() if len(parts) == 2 else "Nguồn báo chí"
        relevant = ("sâu bệnh", "sinh vật gây hại", "dịch hại", "rầy nâu", "đạo ôn", "sâu cuốn lá", "phòng trừ")
        if not any(term in title.lower() for term in relevant):
            continue
        date = email.utils.parsedate_to_datetime(raw_date).astimezone(timezone.utc)
        key = re.sub(r"\W+", " ", title.lower()).strip()
        items[key] = {"title": title, "source": source, "date": date.date().isoformat(), "url": url, "summary": summary(title)}

latest = sorted(items.values(), key=lambda item: item["date"], reverse=True)[:6]
payload = {"updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"), "items": latest}
Path("news-data.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {len(latest)} news items")
