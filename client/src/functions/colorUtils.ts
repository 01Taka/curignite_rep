import { HexColorCode } from "../types/util/utilTypes";

export function chooseTextColor(hexColor: HexColorCode): 'black' | 'white' {
  // HexコードをRGB値に変換
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    throw new Error('Invalid hex color');
  }

  // WCAG 2.0の最小コントラスト比 (7:1) を超えるか判定
  const luminance = rgbToLuminance(rgb);
  const contrastRatio = luminance > 0.05 ? (1 + luminance) / luminance : luminance + 1;

  return contrastRatio >= 7 ? 'black' : 'white';
}

// HexコードをRGBオブジェクトに変換する関数
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// RGB値から相対輝度を計算する関数
function rgbToLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  const rsrgb = r / 255;
  const gsrgb = g / 255;
  const bsrgb = b / 255;

  const red = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const green = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const blue = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}