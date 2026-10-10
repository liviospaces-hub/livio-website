from pathlib import Path
from PIL import Image
import shutil
import json

raw = Path(r"d:\sherwood\livio-website\public\images\works\_raw")
out_root = Path(r"d:\sherwood\livio-website\public\images\works")

projects = {
    "nellimattam": [
        "Nellimattam.jpg",
        "Nellimattam 2.jpg",
        "NELLIMATAM 3D1.jpg",
        "NELLIMATAM 3D3.jpg",
    ],
    "sheeja-ibrahim": [
        "SHEEJA IBRAHIM 3D 1.jpg",
        "SHEEJA IBRAHIM 3D 3.jpg",
    ],
    "kochi": [
        "kochi final.png",
    ],
    "basheer": [
        "Basheer final.jpg",
    ],
    "hasan": [
        "HASAN 3D1.jpg",
    ],
    "nadapuram": [
        "Nadapuram.jpg",
    ],
    "interiors": [
        "BEDROOM 2.jpg",
        "GROUND FLOOR BEDROOM.jpg",
        "GROUND FLOOR BEDROOM 2ND VIEW.jpg",
        "BED 01.jpg",
        "BED 02.jpg",
        "BED 04.jpg",
        "living  out.JPG",
        "living view 2 out.JPG",
    ],
    "exteriors": [
        "EXTERIOR VIEW.jpg",
        "EXTERIOR_1ST_VIEW.jpg",
        "EXTERIOR .jpg",
        "FINAL OUT.jpg",
        "Elevation 01.jpg",
        "elevation out.jpg",
        "Edit.jpg",
        "new 3d.jpg",
        "IMG_0034.JPG",
        "IMG_0035.JPG",
        "IMG_0018.JPG",
        "IMG_0019.JPG",
        "IMG_0036.JPG",
        "IMG_0037.JPG",
        "IMG_0039.JPG",
        "IMG_0040.JPG",
        "IMG_0053.JPG",
        "IMG_5941.JPG",
    ],
}

MAX_EDGE = 2000
QUALITY = 82
manifest = {}


def find_src(name: str) -> Path | None:
    direct = raw / name
    if direct.exists():
        return direct
    matches = [p for p in raw.iterdir() if p.name.lower() == name.lower()]
    return matches[0] if matches else None


for slug, files in projects.items():
    dest = out_root / slug
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True, exist_ok=True)
    saved = []
    for i, name in enumerate(files, start=1):
        src = find_src(name)
        if not src:
            print("MISSING", name)
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
        out = dest / f"{i:02d}.jpg"
        im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        saved.append(f"/images/works/{slug}/{out.name}")
        print(f"OK {slug}/{out.name} <- {src.name} ({out.stat().st_size // 1024}KB)")
    manifest[slug] = saved

for p in out_root.glob("*.jpg"):
    p.unlink()
    print("removed", p.name)

(out_root / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print("DONE")
