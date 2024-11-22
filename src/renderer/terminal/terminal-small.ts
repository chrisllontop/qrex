import type { QRData, QRexOptions } from "../../types/qrex.type";

export class TerminalSmall {
  private backgroundWhite = "\x1b[47m";
  private backgroundBlack = "\x1b[40m";
  private foregroundWhite = "\x1b[37m";
  private foregroundBlack = "\x1b[30m";
  private reset = "\x1b[0m";
  private lineSetupNormal = this.backgroundWhite + this.foregroundBlack; // setup colors
  private lineSetupInverse = this.backgroundBlack + this.foregroundWhite; // setup colors

  private createPalette(lineSetup: string, foregroundWhite: string, foregroundBlack: string) {
    return {
      // 1 ... white, 2 ... black, 0 ... transparent (default)
      "00": `${this.reset} ${lineSetup}`,
      "01": `${this.reset + foregroundWhite}▄${lineSetup}`,
      "02": `${this.reset + foregroundBlack}▄${lineSetup}`,
      10: `${this.reset + foregroundWhite}▀${lineSetup}`,
      11: " ",
      12: "▄",
      20: `${this.reset + foregroundBlack}▀${lineSetup}`,
      21: "▀",
      22: "█",
    };
  }

  /**
   * Returns code for QR pixel
   */
  private mkCodePixel(modules: boolean[][], size: number, x: number, y: number): "0" | "1" | "2" {
    const sizePlus = size + 1;
    if (x >= sizePlus || y >= sizePlus || y < -1 || x < -1) return "0";
    if (x >= size || y >= size || y < 0 || x < 0) return "1";
    const idx = y * size + x;
    return modules[idx] ? "2" : "1";
  }

  /**
   * Returns code for four QR pixels. Suitable as key in palette.
   */
  private mkCode(modules: boolean[][], size: number, x: number, y: number): string {
    return this.mkCodePixel(modules, size, x, y) + this.mkCodePixel(modules, size, x, y + 1);
  }

  public render(qrData: QRData, options?: QRexOptions): string {
    const size = qrData.modules.size;
    const data = qrData.modules.data;

    const inverse = !!options?.inverse;
    const lineSetup = options?.inverse ? this.lineSetupInverse : this.lineSetupNormal;
    const white = inverse ? this.foregroundBlack : this.foregroundWhite;
    const black = inverse ? this.foregroundWhite : this.foregroundBlack;

    const palette = this.createPalette(lineSetup, white, black);
    const newLine = `${this.reset}
${lineSetup}`;

    let output = lineSetup; // setup colors

    for (let y = -1; y < size + 1; y += 2) {
      for (let x = -1; x < size; x++) {
        output += palette[this.mkCode(data, size, x, y)];
      }

      output += palette[this.mkCode(data, size, size, y)] + newLine;
    }

    output += this.reset;

    return output;
  }
}
