import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import harmoniesPlugin from 'colord/plugins/harmonies';
import namesPlugin from 'colord/plugins/names';
import lchPlugin from 'colord/plugins/lch';
import cmykPlugin from 'colord/plugins/cmyk';
import mixPlugin from 'colord/plugins/mix';

extend([a11yPlugin, harmoniesPlugin, namesPlugin, lchPlugin, cmykPlugin, mixPlugin]);

export function parseColor(colorStr) {
  const c = colord(colorStr);
  if (!c.isValid()) return colord('#8B5CF6');
  return c;
}

export function getColorFormats(colorStr) {
  const c = parseColor(colorStr);
  const hex = c.toHex().toUpperCase();
  const rgb = c.toRgb();
  const hsl = c.toHsl();
  const hsv = c.toHsv();
  const cmyk = c.toCmyk();
  const name = c.toName({ closest: true }) || 'Desconocido';

  return {
    hex,
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
    hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
    hsla: `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a})`,
    hsv: `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`,
    cmyk: `cmyk(${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%)`,
    name: capitalize(name),
    isDark: c.isDark(),
    luminance: c.luminance(),
  };
}

export function generateHarmony(hex, type = 'analogous') {
  const c = parseColor(hex);
  let colors = [];
  switch (type) {
    case 'monochromatic':
      colors = [
        c.darken(0.3).toHex().toUpperCase(),
        c.darken(0.15).toHex().toUpperCase(),
        c.toHex().toUpperCase(),
        c.lighten(0.15).toHex().toUpperCase(),
        c.lighten(0.3).toHex().toUpperCase()
      ];
      break;
    case 'analogous':
      colors = c.harmonies('analogous').map(x => x.toHex().toUpperCase());
      break;
    case 'complementary':
      colors = c.harmonies('complementary').map(x => x.toHex().toUpperCase());
      break;
    case 'split-complementary':
      colors = c.harmonies('split-complementary').map(x => x.toHex().toUpperCase());
      break;
    case 'triadic':
      colors = c.harmonies('triadic').map(x => x.toHex().toUpperCase());
      break;
    case 'tetradic':
      colors = c.harmonies('tetradic').map(x => x.toHex().toUpperCase());
      break;
    default:
      colors = [hex];
  }
  return colors;
}

export function generateShadesAndTints(hex, count = 10) {
  const c = parseColor(hex);
  const tints = [];
  const shades = [];
  const tones = [];

  for (let i = 1; i <= count; i++) {
    const factor = i / (count + 1);
    tints.push(c.lighten(factor * 0.4).toHex().toUpperCase());
    shades.push(c.darken(factor * 0.4).toHex().toUpperCase());
    tones.push(c.grayscale().lighten(factor * 0.2).toHex().toUpperCase());
  }

  return { tints, shades, tones };
}

export function generateScale50to950(hex) {
  const c = parseColor(hex);
  return {
    50: c.lighten(0.42).toHex().toUpperCase(),
    100: c.lighten(0.35).toHex().toUpperCase(),
    200: c.lighten(0.26).toHex().toUpperCase(),
    300: c.lighten(0.17).toHex().toUpperCase(),
    400: c.lighten(0.08).toHex().toUpperCase(),
    500: c.toHex().toUpperCase(),
    600: c.darken(0.08).toHex().toUpperCase(),
    700: c.darken(0.17).toHex().toUpperCase(),
    800: c.darken(0.26).toHex().toUpperCase(),
    900: c.darken(0.35).toHex().toUpperCase(),
    950: c.darken(0.42).toHex().toUpperCase(),
  };
}

export function getContrastRatio(fgHex, bgHex) {
  const fg = parseColor(fgHex);
  const bg = parseColor(bgHex);
  const ratio = fg.contrast(bg);
  return {
    ratio: Math.round(ratio * 100) / 100,
    isAA: ratio >= 4.5,
    isAALarge: ratio >= 3.0,
    isAAA: ratio >= 7.0,
    isAAALarge: ratio >= 4.5,
  };
}

export function getRandomHex() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getRandomPalette(count = 5) {
  const baseHex = getRandomHex();
  const harmonies = ['analogous', 'triadic', 'split-complementary', 'monochromatic', 'tetradic'];
  const randomHarmony = harmonies[Math.floor(Math.random() * harmonies.length)];
  let palette = generateHarmony(baseHex, randomHarmony);

  while (palette.length < count) {
    palette.push(getRandomHex());
  }

  return palette.slice(0, count).map((hex, idx) => ({
    id: `color-${idx}-${Date.now()}`,
    hex,
    isLocked: false,
    name: getColorFormats(hex).name,
  }));
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const COLORBLIND_MATRICES = {
  normal: 'none',
  protanopia: 'url(#protanopia)',
  deuteranopia: 'url(#deuteranopia)',
  tritanopia: 'url(#tritanopia)',
  achromatopsia: 'url(#achromatopsia)',
};
