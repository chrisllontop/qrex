import { type QRCodeToDataURLOptionsJpegWebp as RendererOptions, type QRCode } from "qrcode";

const backgroundWhite = "\x1b[47m";
const backgroundBlack = "\x1b[40m";
const foregroundWhite = "\x1b[37m";
const foregroundBlack = "\x1b[30m";
const reset = "\x1b[0m";
const lineSetupNormal = backgroundWhite + foregroundBlack; // setup colors
const lineSetupInverse = backgroundBlack + foregroundWhite; // setup colors

const createPalette = (
  lineSetup: string,
  foregroundWhite: string,
  foregroundBlack: string
): Record<string, string> => ({
  // 1 ... white, 2 ... black, 0 ... transparent (default)

  "00": `${reset} ${lineSetup}`,
  "01": `${reset + foregroundWhite}▄${lineSetup}`,
  "02": `${reset + foregroundBlack}▄${lineSetup}`,
  10: `${reset + foregroundWhite}▀${lineSetup}`,
  11: " ",
  12: "▄",
  20: `${reset + foregroundBlack}▀${lineSetup}`,
  21: "▀",
  22: "█",
});

/**
 * Returns code for QR pixel
 * @param {boolean[][]} modules
 * @param {number} size
 * @param {number} x
 * @param {number} y
 * @return {'0' | '1' | '2'}
 */
const mkCodePixel = (modules: boolean[][], size: number, x: number, y: number): string => {
  const sizePlus = size + 1;
  if (x >= sizePlus || y >= sizePlus || y < -1 || x < -1) return "0";
  if (x >= size || y >= size || y < 0 || x < 0) return "1";
  const idx = y * size + x;
  return modules[idx] ? "2" : "1";
};

/**
 * Returns code for four QR pixels. Suitable as key in palette.
 * @param {boolean[][]} modules
 * @param {number} size
 * @param {number} x
 * @param {number} y
 * @return {keyof palette}
 */
const mkCode = (modules: boolean[][], size: number, x: number, y: number): number => (
  mkCodePixel(modules, size, x, y) + mkCodePixel(modules, size, x, y + 1)
);

export function render(qrData: QRCode, options: RenderOptions, cb: function) {
  const size = qrData.modules.size;
  const data = qrData.modules.data;

  const inverse = !!options?.inverse;
  const lineSetup = options?.inverse ? lineSetupInverse : lineSetupNormal;
  const white = inverse ? foregroundBlack : foregroundWhite;
  const black = inverse ? foregroundWhite : foregroundBlack;

  const palette = createPalette(lineSetup, white, black);
  const newLine = `${reset}
${lineSetup}`;

  let output = lineSetup; // setup colors

  for (let y = -1; y < size + 1; y += 2) {
    for (let x = -1; x < size; x++) {
      output += palette[mkCode(data, size, x, y)];
    }

    output += palette[mkCode(data, size, size, y)] + newLine;
  }

  output += reset;

  if (typeof cb === "function") {
    cb(null, output);
  }

  return output;
}

export const TerminalSmall = {
  render,
};
