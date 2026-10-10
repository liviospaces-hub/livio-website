"""Download interior project images from Google Drive into public/images/works."""
from pathlib import Path

import gdown

ROOT = Path(__file__).resolve().parents[1] / "public" / "images" / "works"

PROJECTS = {
    "interior-nadapuram-kozhikode": [
        "1fCziSY09LVsW2a_DFPA4_8m57VQORu9_",
        "11IvczS2W0breFQ5XzQiiI-sYZm8NrnsW",
        "1svJKvr456lCF5JH8a17tBLUe0uuSBfk4",
        "1_NemeaWfsaW1FW4JXTBR5TbNwdGFxBwi",
        "1Wd9WeDXnPcmC7h6xZcVHnZ347MtYpPcB",
    ],
    "interior-kothamangalam-ernakulam": [
        "1GmUQUikmKnXwKKpIVPQuCymr38vuG7tV",
        "1DI8MFD-NbqH9soUeTFuUiKTd0lsyQePL",
        "1oJdZ9QrOeMV3zf8BKXZOfpkT3wf7qc14",
        "1u4ekUAgUW8Ckly-oK-X5ZayJt1uFbpCH",
    ],
    "interior-kuwait": [
        "1CVZfPh-vXiU40V5MISQCL8LETq8-w054",
        "14MreFExu4-2QZDpM-GaazHLPwS8pd-H3",
        "1yc3VdnJur2j5Jlqx8NK-Mj6Pp5sHM-qf",
    ],
}

EXT_BY_MAGIC = {
    b"\xff\xd8\xff": ".jpg",
    b"\x89PNG": ".png",
    b"RIFF": ".webp",
    b"GIF8": ".gif",
}


def sniff_ext(path: Path) -> str:
    head = path.read_bytes()[:12]
    if head.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if head.startswith(b"\x89PNG"):
        return ".png"
    if head.startswith(b"RIFF") and head[8:12] == b"WEBP":
        return ".webp"
    if head.startswith(b"GIF8"):
        return ".gif"
    return ".jpg"


def main() -> None:
    for slug, ids in PROJECTS.items():
        folder = ROOT / slug
        folder.mkdir(parents=True, exist_ok=True)
        for i, file_id in enumerate(ids, start=1):
            tmp = folder / f"_{i:02d}.bin"
            if tmp.exists():
                tmp.unlink()
            print(f"downloading {slug} {i:02d} {file_id}")
            out = gdown.download(id=file_id, output=str(tmp), quiet=False)
            if not out or not tmp.exists() or tmp.stat().st_size < 1000:
                raise SystemExit(f"failed {slug} {file_id} -> {out}")
            ext = sniff_ext(tmp)
            dest = folder / f"{i:02d}{ext}"
            if dest.exists():
                dest.unlink()
            tmp.rename(dest)
            print(f"  saved {dest.name} ({dest.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
