import type { QRData, QrexOptions } from "../types/qrex.type";
import { Terminal } from "./terminal/terminal";
import { TerminalSmall } from "./terminal/terminal-small";

export class RendererTerminal {
  private terminal = new Terminal();
  private terminalSmall = new TerminalSmall();

  public render(qrData: QRData, options?: QrexOptions): string {
    if (options?.small) {
      return this.terminalSmall.render(qrData, options);
    }
    return this.terminal.render(qrData);
  }
}
