# Video Encoding Guide

All gallery videos must be web-optimized before adding them to the portfolio. Raw engine exports are typically 10–40× larger than necessary and lack the `faststart` flag, causing severe buffering and load lag in browsers.

This guide documents the exact process used and must be followed 1:1 for any new videos added to the project.

---

## Requirements

- **ffmpeg** must be installed and available on your PATH.
  - Windows (this project): `C:\Program Files\ImageMagick-7.0.10-Q16-HDRI\ffmpeg.exe`
  - Mac/Linux: install via `brew install ffmpeg` or your package manager
- Verify it is available with: `ffmpeg -version`
- Confirm `libx264` appears in the configuration output.

---

## Directory Structure

```
src/media/gallery/
├── OriginalVideo.mp4          ← raw source export (keep as backup)
└── web/
    └── OriginalVideo.mp4      ← web-optimized output (this is what the app imports)
```

The app always imports from `src/media/gallery/web/`. Never import the originals.

---

## Encoding Settings

| Setting | Value | Reason |
|---|---|---|
| Codec | `libx264` | Universal browser support, best compression |
| CRF | `20` | Visually lossless quality, 8–40× smaller than raw exports |
| Preset | `slow` | Better compression at same quality (worth the extra encode time) |
| Audio | `aac 128k` | Standard web audio; use `-an` instead if video has no audio |
| `faststart` | enabled | Moves moov atom to file start so browser can play before full download |
| FPS | preserve original | Do **not** force a different frame rate — keep whatever the source was |

---

## Checking if a Video Needs Re-encoding

Run this to inspect any video file:

```bash
ffmpeg -i "src/media/gallery/MyVideo.mp4"
```

Look for these red flags in the output:

1. **High bitrate** — anything above ~3000 kbps for 1080p is wasteful for web delivery
2. **`moov` atom position** — run the check below; if moov is at the end, the file lacks faststart
3. **File already exists in `web/`** — if a matching file exists in `web/` and was encoded by this process, skip it

To check moov atom position:

```bash
ffprobe -v quiet -print_format json -show_format "src/media/gallery/MyVideo.mp4" | grep "start_time"
```

Or simply: if the file was a raw engine export (Unreal, Houdini, Blender, etc.) and has not been processed by this script, it needs re-encoding.

---

## Encoding a Single New Video

```bash
ffmpeg \
  -i "src/media/gallery/MyNewVideo.mp4" \
  -c:v libx264 \
  -crf 20 \
  -preset slow \
  -movflags +faststart \
  -c:a aac \
  -b:a 128k \
  -y \
  "src/media/gallery/web/MyNewVideo.mp4"
```

If the video has **no audio track**, replace `-c:a aac -b:a 128k` with `-an`:

```bash
ffmpeg \
  -i "src/media/gallery/MyNewVideo.mp4" \
  -c:v libx264 \
  -crf 20 \
  -preset slow \
  -movflags +faststart \
  -an \
  -y \
  "src/media/gallery/web/MyNewVideo.mp4"
```

---

## Batch Re-encoding All Videos (Full Reset)

To re-encode every video in `src/media/gallery/` into `src/media/gallery/web/`:

**Linux / Mac / Git Bash (Windows):**

```bash
FFMPEG="ffmpeg"
# Windows with ImageMagick ffmpeg:
# FFMPEG="/c/Program Files/ImageMagick-7.0.10-Q16-HDRI/ffmpeg"

IN="src/media/gallery"
OUT="src/media/gallery/web"

mkdir -p "$OUT"

for f in "$IN"/*.mp4; do
  name=$(basename "$f")
  echo "=== Encoding: $name ==="
  "$FFMPEG" -i "$f" \
    -c:v libx264 -crf 20 -preset slow \
    -movflags +faststart \
    -c:a aac -b:a 128k \
    -y \
    "$OUT/$name"
  echo "Done → $OUT/$name"
done

echo ""
echo "=== Output sizes ==="
ls -lh "$OUT"/*.mp4
```

---

## After Encoding: Registering the New Video in the App

After encoding, you must register the video in **three places**:

### 1. `src/app/assetManifest.ts`

Add an import and an entry to `videoAssets`:

```ts
// Add import at the top with the other video imports
import MyNewVideo from "../media/gallery/web/MyNewVideo.mp4";

// Add entry in videoAssets array
{ type: "video", src: MyNewVideo, label: "My New Video" },
```

This ensures the video is preloaded during the loading screen and its progress is tracked accurately.

### 2. `src/app/components/gallery-page.tsx`

Add an import and an entry to the `galleryItems` array:

```ts
import MyNewVideo from "../../media/gallery/web/MyNewVideo.mp4";

// In galleryItems:
{ type: "video", src: MyNewVideo, label: "My New Video" },
```

### 3. (Optional) `src/app/components/gallery-section.tsx`

Only needed if you want the video to appear in the **homepage featured gallery** (6 slots max). Add an import and an entry to `featuredVideos`. If the video pool is active, also register it there — see the video pool section in `LoadingScreen.tsx`.

---

## Results — Current Encode (March 2026)

All 18 videos re-encoded from raw engine exports. Total payload: **~203 MB → ~52 MB (74% reduction)**.

| File | Original | Web | Reduction |
|---|---|---|---|
| Boulder Destruction.mp4 | 512 KB | 96 KB | 81% |
| Campfire.mp4 | 4.8 MB | 400 KB | 92% |
| Finisher Big.mp4 | 2.8 MB | 748 KB | 74% |
| Finisher Small.mp4 | 2.0 MB | 420 KB | 80% |
| Flamethrower.mp4 | 12.8 MB | 1.8 MB | 87% |
| GodForged Main Menu.mp4 | 55.8 MB | 22.0 MB | 61% |
| Grenade Toon.mp4 | 1.5 MB | 244 KB | 84% |
| Grenade.mp4 | 2.5 MB | 244 KB | 91% |
| Hellbound.mp4 | 11.3 MB | 1.3 MB | 89% |
| Houdini Building Generator.mp4 | 20.1 MB | 2.9 MB | 86% |
| Island.mp4 | 3.5 MB | 524 KB | 86% |
| Lighting.mp4 | 1.8 MB | 216 KB | 89% |
| Metaconstruct Lighting Pass 720p.mp4 | 14.3 MB | 4.3 MB | 70% |
| PyGame Gamejams.mp4 | 11.5 MB | 1.9 MB | 84% |
| Render Target Fog-of-War.mp4 | 29.5 MB | 11.5 MB | 62% |
| Rocket.mp4 | 8.6 MB | 1.0 MB | 89% |
| Snow.mp4 | 11.5 MB | 2.2 MB | 81% |
| Sparks.mp4 | 3.0 MB | 408 KB | 87% |
