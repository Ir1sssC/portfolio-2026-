"""Create committed responsive images; keep every original URL and full-size image.

Run manually with Pillow (WebP and AVIF enabled), then run node build.mjs.
The deployed site and its build do not require Python or an image service.
"""
import json
import re
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'dist/assets'
WIDTHS = (360, 640, 960, 1280, 1920)
GENERATED = re.compile(r'(?:\.(?:optimized|w\d+)\.(?:webp|avif)|\.fallback-w\d+\.jpg)$')


def encode(image, fmt, lossless=False):
    output = BytesIO()
    if fmt == 'avif':
        image.save(output, 'AVIF', quality=85, subsampling='4:4:4', speed=6)
    else:
        image.save(output, 'WEBP', lossless=lossless, quality=96, method=6, exact=True)
    return output.getvalue()


def main():
    images = {}
    for path in sorted(ASSETS.rglob('*')):
        if path.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp'} or GENERATED.search(path.name):
            continue
        relative = path.relative_to(ASSETS).as_posix()
        original_bytes = path.stat().st_size
        with Image.open(path) as source:
            image = ImageOps.exif_transpose(source).convert('RGBA' if 'A' in source.getbands() else 'RGB')
        fmt = 'avif' if path.name.startswith('zhoubi-') else 'webp'
        lossless = path.suffix == '.png' and any(label in relative for label in ('stickers/', 'qr.', 'collaboration.', 'character_cutout'))
        variants = []
        fallback_variants = []
        optimized = relative
        full_bytes = original_bytes
        if path.suffix != '.webp':
            payload = encode(image, fmt, lossless)
            # A conversion that grows has no performance benefit. Original stays usable.
            if len(payload) < original_bytes:
                output = path.with_name(f'{path.stem}.optimized.{fmt}')
                output.write_bytes(payload)
                optimized = output.relative_to(ASSETS).as_posix()
                full_bytes = len(payload)
        if original_bytes > 30000 and image.width > 480:
            for width in WIDTHS:
                if width >= image.width:
                    continue
                height = round(image.height * width / image.width)
                resized = image.resize((width, height), Image.Resampling.LANCZOS)
                payload = encode(resized, fmt, lossless)
                # Do not put a more expensive thumbnail ahead of the full-size source.
                if len(payload) >= full_bytes:
                    continue
                output = path.with_name(f'{path.stem}.w{width}.{fmt}')
                output.write_bytes(payload)
                variants.append({'src':output.relative_to(ASSETS).as_posix(), 'width':width, 'bytes':len(payload)})
                if fmt == 'avif':
                    # Older browsers still get a small, color-faithful JPEG, not a 2 MB original.
                    fallback = path.with_name(f'{path.stem}.fallback-w{width}.jpg')
                    resized.convert('RGB').save(fallback, 'JPEG', quality=96, subsampling=0, optimize=True, progressive=True)
                    fallback_variants.append({'src':fallback.relative_to(ASSETS).as_posix(), 'width':width, 'bytes':fallback.stat().st_size})
        if optimized != relative or path.suffix == '.webp':
            variants.append({'src':optimized, 'width':image.width, 'bytes':full_bytes})
        elif variants:
            # Keep native resolution available, including grain-rich poster artwork.
            output = path.with_name(f'{path.stem}.optimized.{fmt}')
            payload = encode(image, fmt, lossless)
            output.write_bytes(payload)
            variants.append({'src':output.relative_to(ASSETS).as_posix(), 'width':image.width, 'bytes':len(payload)})
        if not variants:
            continue
        if fallback_variants:
            fallback_variants.append({'src':relative, 'width':image.width, 'bytes':original_bytes})
        images[relative] = {'originalBytes':original_bytes, 'width':image.width, 'height':image.height,
                            'alpha':'A' in image.getbands(), 'type':f'image/{fmt}',
                            'encoding':'lossless' if lossless else ('original' if path.suffix == '.webp' else f'{fmt} high quality'),
                            'src':optimized, 'bytes':full_bytes, 'variants':variants, 'fallbackVariants':fallback_variants}
        print(f'{relative}: {original_bytes:,} -> {full_bytes:,} bytes; {len(variants)} sizes', flush=True)
    manifest = {'version':1, 'images':images}
    (ASSETS/'image-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')


if __name__ == '__main__':
    main()
