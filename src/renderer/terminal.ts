import type { QRData, RenderOptions } from "../types/qrex.type.js";
import { Terminal } from "./terminal/terminal.js";
import { TerminalSmall } from "./terminal/terminal-small.js";

export class RendererTerminal {
  private terminal = new Terminal();
  private terminalSmall = new TerminalSmall();

  public render(qrData: QRData, options?: RenderOptions): string {
    if (options?.renderConfig?.small) {
      return this.terminalSmall.render(qrData, options);
    }
    return this.terminal.render(qrData);
  }
}
