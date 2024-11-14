import { type QRCodeToDataURLOptionsJpegWebp as RendererOptions, type QRCode } from "qrcode";

import * as small from "./terminal/terminal-small";
import * as big from "./terminal/terminal";

export function render(qrData: QRCode, options: RendererOptions, cb: function) {
  if (options?.small) {
    return TerminalSmall.render(qrData, options, cb);
  }
  return Terminal.render(qrData, options, cb);
}

export const RendererTerminal = {
  render,
};
