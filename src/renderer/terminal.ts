import type { QRData } from "../types/qrex.type";
import { Terminal } from "./terminal/terminal";
import { TerminalSmall } from "./terminal/terminal-small";

function render(qrData: QRData, options) {
  if (options?.small) {
    return TerminalSmall.render(qrData, options);
  }
  return Terminal.render(qrData, options);
}

export const RendererTerminal = {
  render,
};
