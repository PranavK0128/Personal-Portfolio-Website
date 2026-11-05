export type HsvColor = { hue: number; saturation: number; value: number };

export function normalizeHexColor(input: string): string | null {
  const hex = input.trim().replace(/^#/, "");
  if (/^[\da-f]{3}$/i.test(hex)) {
    return `#${[...hex].map((digit) => digit.repeat(2)).join("")}`.toUpperCase();
  }
  return /^[\da-f]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : null;
}

export function hexToHsv(hex: string): HsvColor {
  const channels = [1, 3, 5].map(
    (index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255,
  );
  const [red, green, blue] = channels;
  const value = Math.max(...channels);
  const delta = value - Math.min(...channels);
  let hue = 0;
  if (delta) {
    if (value === red) hue = (green - blue) / delta;
    else if (value === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue = (hue * 60 + 360) % 360;
  }
  return { hue, saturation: value === 0 ? 0 : delta / value, value };
}

export function hsvToHex({ hue, saturation, value }: HsvColor): string {
  const chroma = value * saturation;
  const sector = (((hue % 360) + 360) % 360) / 60;
  const secondary = chroma * (1 - Math.abs((sector % 2) - 1));
  const channels = [
    [chroma, secondary, 0],
    [secondary, chroma, 0],
    [0, chroma, secondary],
    [0, secondary, chroma],
    [secondary, 0, chroma],
    [chroma, 0, secondary],
  ][Math.floor(sector)];
  return `#${channels
    .map((channel) =>
      Math.round((channel + value - chroma) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}
