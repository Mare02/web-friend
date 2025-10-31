/**
 * Color palette generation service providing various color harmony algorithms
 * All color calculations implemented in pure JavaScript without external dependencies
 */

export interface ColorInfo {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  hsl: {
    h: number;
    s: number;
    l: number;
  };
  name?: string;
}

export interface ColorPalette {
  baseColor: ColorInfo;
  colors: ColorInfo[];
  type: PaletteType;
  name: string;
}

export type PaletteType =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'random';

export interface ColorPaletteResult {
  palettes: ColorPalette[];
  generatedAt: Date;
}

// Color utility functions
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function createColorInfo(hex: string): ColorInfo {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return { hex, rgb, hsl };
}

// Color name approximations (simplified)
function getColorName(hsl: { h: number; s: number; l: number }): string {
  const { h, s, l } = hsl;

  if (l < 15) return "Black";
  if (l > 85) return "White";
  if (s < 10) return l < 50 ? "Gray" : "Light Gray";

  if (h >= 0 && h < 30) return l < 50 ? "Brown" : "Orange";
  if (h >= 30 && h < 60) return l < 50 ? "Olive" : "Yellow";
  if (h >= 60 && h < 120) return l < 50 ? "Green" : "Lime";
  if (h >= 120 && h < 180) return l < 50 ? "Teal" : "Cyan";
  if (h >= 180 && h < 240) return l < 50 ? "Navy" : "Blue";
  if (h >= 240 && h < 300) return l < 50 ? "Purple" : "Magenta";
  if (h >= 300 && h < 360) return l < 50 ? "Maroon" : "Pink";

  return "Unknown";
}

function generateMonochromatic(baseHex: string, count: number = 5): ColorPalette {
  const baseColor = createColorInfo(baseHex);
  const colors: ColorInfo[] = [baseColor];

  const baseHsl = baseColor.hsl;

  // Generate variations by adjusting lightness
  for (let i = 1; i < count; i++) {
    const lightnessStep = (100 - baseHsl.l) / (count - 1);
    const newLightness = Math.max(10, Math.min(90, baseHsl.l + (i * lightnessStep)));
    const rgb = hslToRgb(baseHsl.h, baseHsl.s, newLightness);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const colorInfo = createColorInfo(hex);
    colorInfo.name = getColorName(colorInfo.hsl);
    colors.push(colorInfo);
  }

  return {
    baseColor,
    colors,
    type: 'monochromatic',
    name: 'Monochromatic Palette'
  };
}

function generateAnalogous(baseHex: string, count: number = 5): ColorPalette {
  const baseColor = createColorInfo(baseHex);
  const colors: ColorInfo[] = [];
  const baseHsl = baseColor.hsl;

  // Generate colors within 30 degrees of base hue
  const hueRange = 30;
  const hueStep = hueRange / (count - 1);

  for (let i = 0; i < count; i++) {
    const newHue = (baseHsl.h - hueRange/2 + (i * hueStep) + 360) % 360;
    const rgb = hslToRgb(newHue, baseHsl.s, baseHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const colorInfo = createColorInfo(hex);
    colorInfo.name = getColorName(colorInfo.hsl);
    colors.push(colorInfo);
  }

  return {
    baseColor,
    colors,
    type: 'analogous',
    name: 'Analogous Palette'
  };
}

function generateComplementary(baseHex: string): ColorPalette {
  const baseColor = createColorInfo(baseHex);
  const colors: ColorInfo[] = [baseColor];
  const baseHsl = baseColor.hsl;

  // Complementary color is 180 degrees opposite
  const complementaryHue = (baseHsl.h + 180) % 360;
  const rgb = hslToRgb(complementaryHue, baseHsl.s, baseHsl.l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const complementaryColor = createColorInfo(hex);
  complementaryColor.name = getColorName(complementaryColor.hsl);
  colors.push(complementaryColor);

  return {
    baseColor,
    colors,
    type: 'complementary',
    name: 'Complementary Palette'
  };
}

function generateTriadic(baseHex: string): ColorPalette {
  const baseColor = createColorInfo(baseHex);
  const colors: ColorInfo[] = [baseColor];
  const baseHsl = baseColor.hsl;

  // Triadic colors are 120 degrees apart
  for (let i = 1; i < 3; i++) {
    const newHue = (baseHsl.h + (120 * i)) % 360;
    const rgb = hslToRgb(newHue, baseHsl.s, baseHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const colorInfo = createColorInfo(hex);
    colorInfo.name = getColorName(colorInfo.hsl);
    colors.push(colorInfo);
  }

  return {
    baseColor,
    colors,
    type: 'triadic',
    name: 'Triadic Palette'
  };
}

function generateTetradic(baseHex: string): ColorPalette {
  const baseColor = createColorInfo(baseHex);
  const colors: ColorInfo[] = [baseColor];
  const baseHsl = baseColor.hsl;

  // Tetradic colors form a rectangle on the color wheel
  const angles = [90, 180, 270];
  angles.forEach(angle => {
    const newHue = (baseHsl.h + angle) % 360;
    const rgb = hslToRgb(newHue, baseHsl.s, baseHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const colorInfo = createColorInfo(hex);
    colorInfo.name = getColorName(colorInfo.hsl);
    colors.push(colorInfo);
  });

  return {
    baseColor,
    colors,
    type: 'tetradic',
    name: 'Tetradic Palette'
  };
}

function generateSplitComplementary(baseHex: string): ColorPalette {
  const baseColor = createColorInfo(baseHex);
  const colors: ColorInfo[] = [baseColor];
  const baseHsl = baseColor.hsl;

  // Split complementary: base + two colors adjacent to complementary
  const complementaryHue = (baseHsl.h + 180) % 360;
  const split1 = (complementaryHue - 30 + 360) % 360;
  const split2 = (complementaryHue + 30) % 360;

  [split1, split2].forEach(hue => {
    const rgb = hslToRgb(hue, baseHsl.s, baseHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const colorInfo = createColorInfo(hex);
    colorInfo.name = getColorName(colorInfo.hsl);
    colors.push(colorInfo);
  });

  return {
    baseColor,
    colors,
    type: 'split-complementary',
    name: 'Split-Complementary Palette'
  };
}

function generateRandom(count: number = 5): ColorPalette {
  const colors: ColorInfo[] = [];

  for (let i = 0; i < count; i++) {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 50) + 50; // 50-100%
    const l = Math.floor(Math.random() * 50) + 25; // 25-75%
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const colorInfo = createColorInfo(hex);
    colorInfo.name = getColorName(colorInfo.hsl);
    colors.push(colorInfo);
  }

  const baseColor = colors[0];

  return {
    baseColor,
    colors,
    type: 'random',
    name: 'Random Palette'
  };
}

/**
 * Generate color palettes from a base color
 */
export function generateColorPalettes(baseHex: string): ColorPaletteResult {
  const baseColor = createColorInfo(baseHex);
  baseColor.name = getColorName(baseColor.hsl);

  const palettes: ColorPalette[] = [
    generateMonochromatic(baseHex),
    generateAnalogous(baseHex),
    generateComplementary(baseHex),
    generateTriadic(baseHex),
    generateTetradic(baseHex),
    generateSplitComplementary(baseHex),
  ];

  return {
    palettes,
    generatedAt: new Date()
  };
}

/**
 * Generate a random color palette
 */
export function generateRandomPalette(count: number = 5): ColorPalette {
  return generateRandom(count);
}

/**
 * Validate if a string is a valid hex color
 */
export function isValidHexColor(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

/**
 * Generate CSS linear gradient from color palette
 */
export function generateLinearGradient(colors: ColorInfo[], angle: number = 90): string {
  if (colors.length === 0) return '';

  const colorStops = colors.map((color, index) => {
    const position = colors.length > 1 ? (index / (colors.length - 1)) * 100 : 50;
    return `${color.hex} ${position}%`;
  }).join(', ');

  return `linear-gradient(${angle}deg, ${colorStops})`;
}

/**
 * Generate CSS radial gradient from color palette
 */
export function generateRadialGradient(colors: ColorInfo[]): string {
  if (colors.length === 0) return '';

  const colorStops = colors.map((color, index) => {
    const position = colors.length > 1 ? (index / (colors.length - 1)) * 100 : 50;
    return `${color.hex} ${position}%`;
  }).join(', ');

  return `radial-gradient(circle, ${colorStops})`;
}

/**
 * Generate CSS conic gradient from color palette
 */
export function generateConicGradient(colors: ColorInfo[], angle: number = 0): string {
  if (colors.length === 0) return '';

  const colorStops = colors.map((color, index) => {
    const position = (index / colors.length) * 360;
    return `${color.hex} ${position}deg`;
  }).join(', ');

  return `conic-gradient(from ${angle}deg, ${colorStops})`;
}

/**
 * Generate Tailwind CSS gradient classes
 */
export function generateTailwindGradient(colors: ColorInfo[], type: 'linear' | 'radial' | 'conic' = 'linear'): string {
  if (colors.length === 0) return '';

  let baseClasses = '';

  switch (type) {
    case 'linear':
      baseClasses = 'bg-gradient-to-r';
      break;
    case 'radial':
      baseClasses = 'bg-radial';
      break;
    case 'conic':
      baseClasses = 'bg-conic';
      break;
    default:
      baseClasses = 'bg-gradient-to-r';
  }

  // For multiple colors, use from/via/to syntax
  if (colors.length === 1) {
    return `${baseClasses} from-[${colors[0].hex}]`;
  } else if (colors.length === 2) {
    return `${baseClasses} from-[${colors[0].hex}] to-[${colors[1].hex}]`;
  } else {
    // For 3+ colors, use from/via/to pattern
    const from = `from-[${colors[0].hex}]`;
    const via = colors.length > 2 ? ` via-[${colors[1].hex}]` : '';
    const to = ` to-[${colors[colors.length - 1].hex}]`;
    return `${baseClasses} ${from}${via}${to}`;
  }
}

/**
 * Generate CSS custom properties for gradients
 */
export function generateCSSVariables(colors: ColorInfo[]): string {
  if (colors.length === 0) return '';

  const variables = [
    `--gradient-primary: ${generateLinearGradient(colors)};`,
    `--gradient-radial: ${generateRadialGradient(colors)};`,
    `--gradient-conic: ${generateConicGradient(colors)};`
  ];

  // Add individual color variables
  colors.forEach((color, index) => {
    variables.push(`--color-${index + 1}: ${color.hex};`);
  });

  return variables.join('\n');
}
