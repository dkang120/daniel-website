"""Cache-bust CSS/JS: set every ?v= to a hash of that file's contents.

Run after any CSS/JS edit:  python3 tools/bust.py
A changed file always gets a new URL; an unchanged file keeps its URL,
so browsers never mix an old stylesheet with a new page (or the reverse).
"""
import hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
REF = re.compile(r'((?:css|js)/([\w-]+\.(?:css|js)))\?v=[\w]+')

def h(rel):
    return hashlib.md5((ROOT / rel).read_bytes()).hexdigest()[:8]

changed = 0
for page in ROOT.rglob("*.html"):
    if ".git" in page.parts:
        continue
    s = page.read_text()
    n = REF.sub(lambda m: f"{m.group(1)}?v={h(m.group(1))}", s)
    if n != s:
        page.write_text(n)
        changed += 1
print(f"updated {changed} pages")
