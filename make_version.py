"""公開の前に自動で動く（GitHub Actions）。ファイルの中身から短い印を作って、
index.html / setup.html の読み込みURLの ?v=〇〇 を書き換える → 更新したら必ず新しいものが読み込まれる。
手元で試すときは:  python make_version.py
"""
import hashlib, pathlib, re

root = pathlib.Path(__file__).parent

def digest(b):
    return hashlib.md5(b).hexdigest()[:8]

for page in ("index.html", "setup.html"):
    p = root / page
    if not p.exists():
        continue
    s = p.read_text(encoding="utf-8")
    for name in ("style.css", "config.js", "main.js", "setup.js"):
        f = root / name
        if f.exists():
            s = re.sub(re.escape(name) + r'(\?v=[^"\']*)?(?=["\'])', f"{name}?v={digest(f.read_bytes())}", s)
    p.write_text(s, encoding="utf-8")
print("?v= を更新しました")
