import argparse
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from moviepy import CompositeVideoClip, ImageClip, VideoFileClip
from moviepy.video.fx import FadeIn


def _load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in (
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Verdana.ttf",
        "/System/Library/Fonts/Supplemental/Tahoma.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttf",
    ):
        if os.path.exists(candidate):
            try:
                return ImageFont.truetype(candidate, size=size)
            except Exception:
                pass
    return ImageFont.load_default()


def build_overlay_rgba(
    text: str,
    *,
    checkmark: str = "✓",
    padding_px: int = 28,
    radius_px: int = 24,
    font_size: int = 54,
    text_color=(255, 255, 255, 255),
    pill_color=(12, 18, 28, 190),
    accent_color=(46, 204, 113, 255),
) -> np.ndarray:
    font = _load_font(font_size)
    mark_font = _load_font(font_size + 6)

    dummy = Image.new("RGBA", (10, 10), (0, 0, 0, 0))
    d = ImageDraw.Draw(dummy)
    text_bbox = d.textbbox((0, 0), text, font=font)
    mark_bbox = d.textbbox((0, 0), checkmark, font=mark_font)

    text_w = text_bbox[2] - text_bbox[0]
    text_h = text_bbox[3] - text_bbox[1]
    mark_w = mark_bbox[2] - mark_bbox[0]
    mark_h = mark_bbox[3] - mark_bbox[1]

    gap = 16
    icon_box = max(mark_w, mark_h) + 28
    pill_h = max(text_h, icon_box) + padding_px * 2
    pill_w = icon_box + gap + text_w + padding_px * 2

    img = Image.new("RGBA", (pill_w, pill_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle(
        (0, 0, pill_w, pill_h),
        radius=radius_px,
        fill=pill_color,
    )

    icon_left = padding_px
    icon_top = (pill_h - icon_box) // 2
    icon_right = icon_left + icon_box
    icon_bottom = icon_top + icon_box

    draw.ellipse((icon_left, icon_top, icon_right, icon_bottom), fill=accent_color)

    mark_x = icon_left + (icon_box - mark_w) // 2
    mark_y = icon_top + (icon_box - mark_h) // 2 - 2
    draw.text((mark_x, mark_y), checkmark, font=mark_font, fill=(255, 255, 255, 255))

    text_x = icon_right + gap
    text_y = (pill_h - text_h) // 2 - text_bbox[1]
    draw.text((text_x, text_y), text, font=font, fill=text_color)

    return np.array(img)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument(
        "--overlay",
        action="append",
        default=[],
        help='Repeatable. Format: "start,end,text" (e.g. \'2,3,Camera detected\')',
    )
    parser.add_argument("--fadein", type=float, default=1.0, help="Fade-in seconds (per overlay).")
    parser.add_argument("--pos", default="bottom", choices=["center", "top", "bottom"])
    parser.add_argument("--bottom-margin", type=int, default=120)
    parser.add_argument("--top-margin", type=int, default=120)
    parser.add_argument("--scale", type=float, default=0.72, help="Overlay scale factor.")
    parser.add_argument("--font-size", type=int, default=44)
    parser.add_argument("--padding", type=int, default=20)
    parser.add_argument("--radius", type=int, default=18)
    args = parser.parse_args()

    base = VideoFileClip(args.input)

    overlays = args.overlay or ["2,3,Camera detected"]
    overlay_clips = []

    for spec in overlays:
        parts = [p.strip() for p in spec.split(",", 2)]
        if len(parts) != 3:
            raise SystemExit(f"Invalid --overlay '{spec}'. Expected: start,end,text")
        start_s = float(parts[0])
        end_s = float(parts[1])
        text = parts[2]
        duration_s = max(0.01, end_s - start_s)

        overlay_rgba = build_overlay_rgba(
            text,
            font_size=args.font_size,
            padding_px=args.padding,
            radius_px=args.radius,
        )

        clip = (
            ImageClip(overlay_rgba, is_mask=False)
            .resized(args.scale)
            .with_start(start_s)
            .with_duration(duration_s)
            .with_effects([FadeIn(min(args.fadein, duration_s))])
        )

        if args.pos == "top":
            clip = clip.with_position(("center", args.top_margin))
        elif args.pos == "bottom":
            clip_h = int(round(overlay_rgba.shape[0] * args.scale))
            clip = clip.with_position(("center", base.h - clip_h - args.bottom_margin))
        else:
            clip = clip.with_position("center")

        overlay_clips.append(clip)

    out = CompositeVideoClip([base, *overlay_clips])
    out.write_videofile(
        args.output,
        codec="libx264",
        audio_codec="aac",
        temp_audiofile="temp-audio.m4a",
        remove_temp=True,
        fps=base.fps,
        preset="medium",
        threads=4,
    )
    base.close()
    out.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

