from pathlib import Path
from PIL import Image
import shutil
import json

raw = Path(r"d:\sherwood\livio-website\public\images\works\_raw")
out_root = Path(r"d:\sherwood\livio-website\public\images\works")

# Drive file ID → source filename (from prior folder download)
projects = [
    {
        "slug": "nadapuram-kozhikode",
        "src": "Nadapuram.jpg",
        "title": "Residence at Nadapuram",
        "location": "Nadapuram, Kozhikode",
    },
    {
        "slug": "kanjirappally-kottayam",
        "src": "elevation out.jpg",
        "title": "Residence at Kanjirappally",
        "location": "Kanjirappally, Kottayam",
    },
    {
        "slug": "kothamangalam-ernakulam",
        "src": "Nellimattam 2.jpg",
        "title": "Residence at Kothamangalam",
        "location": "Kothamangalam, Ernakulam",
    },
    {
        "slug": "nadapuram-kozhikode-2",
        "src": "IMG_0034.JPG",
        "title": "Residence at Nadapuram",
        "location": "Nadapuram, Kozhikode",
    },
    {
        "slug": "muvattupuzha-ernakulam",
        "src": "Edit.jpg",
        "title": "Residence at Muvattupuzha",
        "location": "Muvattupuzha, Ernakulam",
    },
    {
        "slug": "kothamangalam-ernakulam-2",
        "src": "Elevation 01.jpg",
        "title": "Residence at Kothamangalam",
        "location": "Kothamangalam, Ernakulam",
    },
    {
        "slug": "perumbavoor-ernakulam",
        "src": "IMG_5941.JPG",
        "title": "Residence at Perumbavoor",
        "location": "Perumbavoor, Ernakulam",
    },
    {
        "slug": "perumbavoor-ernakulam-2",
        "src": "EXTERIOR .jpg",
        "title": "Residence at Perumbavoor",
        "location": "Perumbavoor, Ernakulam",
    },
    {
        "slug": "aluva-ernakulam",
        "src": "new 3d.jpg",
        "title": "Residence at Aluva",
        "location": "Aluva, Ernakulam",
    },
    {
        "slug": "aluva-ernakulam-2",
        "src": "SHEEJA IBRAHIM 3D 1.jpg",
        "title": "Residence at Aluva",
        "location": "Aluva, Ernakulam",
    },
    {
        "slug": "kothamangalam-ernakulam-3",
        "src": "kochi final.png",
        "title": "Residence at Kothamangalam",
        "location": "Kothamangalam, Ernakulam",
    },
]

# Remove previous project folders (keep service assets + _raw)
keep_files = {"arch.png", "int.png", "spatial.jpg", "manifest.json"}
keep_dirs = {"_raw", "_dl"}
for p in out_root.iterdir():
    if p.is_dir() and p.name not in keep_dirs:
        shutil.rmtree(p)
        print("removed dir", p.name)

MAX_EDGE = 2000
QUALITY = 82
manifest = {}


def find_src(name: str) -> Path | None:
    direct = raw / name
    if direct.exists():
        return direct
    matches = [p for p in raw.iterdir() if p.name.lower() == name.lower()]
    return matches[0] if matches else None


for i, proj in enumerate(projects, start=1):
    dest = out_root / proj["slug"]
    dest.mkdir(parents=True, exist_ok=True)
    src = find_src(proj["src"])
    if not src:
        print("MISSING", proj["src"])
        continue
    im = Image.open(src)
    if im.mode in ("RGBA", "P"):
        im = im.convert("RGB")
    elif im.mode != "RGB":
        im = im.convert("RGB")
    w, h = im.size
    scale = min(1.0, MAX_EDGE / max(w, h))
    if scale < 1.0:
        im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    out = dest / "01.jpg"
    im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    path = f"/images/works/{proj['slug']}/01.jpg"
    manifest[proj["slug"]] = {
        "number": f"{i:02d}",
        "title": proj["title"],
        "location": proj["location"],
        "image": path,
        "images": [path],
        "src": proj["src"],
        "kb": out.stat().st_size // 1024,
    }
    print(f"OK {i:02d} {proj['slug']} <- {src.name} ({manifest[proj['slug']]['kb']}KB)")

(out_root / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print("DONE", len(manifest), "projects")
