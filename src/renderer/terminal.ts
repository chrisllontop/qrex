import type { QRData, QRexOptions } from "../types/qrex.type";
import { Terminal } from "./terminal/terminal";
import { TerminalSmall } from "./terminal/terminal-small";

export class RendererTerminal {
  private terminal = new Terminal();
  private terminalSmall = new TerminalSmall();

  public render(qrData: QRData, options?: QRexOptions): string {
    if (options?.small) {
      return this.terminalSmall.render(qrData, options);
    }
    return this.terminal.render(qrData, options);
  }
}
