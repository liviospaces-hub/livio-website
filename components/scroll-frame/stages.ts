/**
 * Scroll-frame stage config — single editable block.
 *
 * `from` / `to` are normalized ScrollTrigger progress values in [0, 1].
 * Tune these after reviewing real cut-points in the frame sequence
 * (80 frames: frame-0001.webp … frame-0080.webp).
 *
 * Ranges should be contiguous and non-overlapping so only one label
 * is mid-transition at a time (out completes before next in).
 */
export type ScrollFrameStage = {
  id: string;
  title: string;
  subtitle: string;
  /** Inclusive start of stage in scroll progress 0–1 */
  from: number;
  /** Exclusive end of stage in scroll progress 0–1 */
  to: number;
};

export const SCROLL_FRAME_TOTAL = 80;
export const SCROLL_FRAME_PAD = 4;
export const SCROLL_FRAME_DIR = "/video/animated-video";
export const SCROLL_FRAME_PREFIX = "frame-";
export const SCROLL_FRAME_EXT = ".webp";

/** Build public URL for 1-based frame index (1 … SCROLL_FRAME_TOTAL). */
export function scrollFrameSrc(index1Based: number): string {
  const n = String(index1Based).padStart(SCROLL_FRAME_PAD, "0");
  return `${SCROLL_FRAME_DIR}/${SCROLL_FRAME_PREFIX}${n}${SCROLL_FRAME_EXT}`;
}

/**
 * Placeholder stage copy + ranges — retune once sequence cut-points are reviewed.
 * Progress mapping: 0 = first frame, 1 = last frame.
 */
export const SCROLL_FRAME_STAGES: ScrollFrameStage[] = [
  {
    id: "ground",
    title: "The site takes shape",
    subtitle: "Ground, orientation, and the first lines of intent.",
    from: 0,
    to: 0.22,
  },
  {
    id: "structure",
    title: "Structure rises",
    subtitle: "Volumes lock in — rhythm, span, and structural clarity.",
    from: 0.22,
    to: 0.48,
  },
  {
    id: "envelope",
    title: "Envelope & light",
    subtitle: "Facades, openings, and daylight begin to define the rooms.",
    from: 0.48,
    to: 0.72,
  },
  {
    id: "finish",
    title: "Space comes alive",
    subtitle: "Material, atmosphere, and the lived-in finish of the build.",
    from: 0.72,
    to: 1,
  },
];
