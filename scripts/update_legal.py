#!/usr/bin/env python3
"""Collect newly published pesticide-policy notices from the official PPD site."""
import html
import json
import re
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

BASE = "https://ppd.gov.vn"
SOURCES = [
    BASE + "/",
    BASE + "/thuoc-bao-ve-thuc-vat-67.html",
    BASE + "/van-ban-chinh-sach.html",
]
ROOT = Path(__file__).resolve().parents[1]


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "AgrotechTruongLam-LegalMonitor/1.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8", "replace")


def clean(value):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", value))).strip()


def collect():
    found = {}
    pattern = re.compile(
        r'<a href="(?P<href>[^"]+)" title=[\'\"](?P<title>.*?)[\'\"] class=[\'\"]title[\'\"].*?</a>'
        r'(?P<tail>.{0,1100}?)Ngày đăng:\s*(?:</?[^>]+>\s*)*(?P<date>\d{2}/\d{2}/\d{4})',
        re.I | re.S,
    )
    for source in SOURCES:
        body = fetch(source)
        for match in pattern.finditer(body):
            title = clean(match.group("title"))
            lower = title.lower()
            explicitly_tracked = re.search(r"(?:thông tư\s+(?:27|28)/2026|nghị định(?:\s+số)?\s+33/2026)", lower)
            if len(title) > 240 or not (explicitly_tracked or any(word in lower for word in ("thuốc bảo vệ thực vật", "bảo vệ thực vật"))):
                continue
            href = match.group("href")
            url = href if href.startswith("http") else BASE + href
            found[url] = {"title": title, "date": match.group("date"), "url": url, "source": "Cục Trồng trọt và Bảo vệ thực vật"}
    decree_33 = BASE + "/tin-moi-nhat-289/nghi-dinh-so-332026nd-cp-cua-chinh-phu-sua-doi-bo-sung-mot-so-dieu-cua-cac-nghi-dinh-trong-linh-vuc-trong-trot-va-bao-ve-thuc-vat.html"
    found.setdefault(decree_33, {"title": "Nghị định 33/2026/NĐ-CP sửa đổi, bổ sung các Nghị định trong lĩnh vực trồng trọt và bảo vệ thực vật", "date": "30/01/2026", "url": decree_33, "source": "Cục Trồng trọt và Bảo vệ thực vật"})
    return sorted(found.values(), key=lambda x: datetime.strptime(x["date"], "%d/%m/%Y"), reverse=True)[:12]


def main():
    vn = timezone(timedelta(hours=7))
    payload = {"updatedAt": datetime.now(vn).isoformat(timespec="minutes"), "items": collect()}
    (ROOT / "legal-updates.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {len(payload['items'])} legal notices")


if __name__ == "__main__":
    main()
