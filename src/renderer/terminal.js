import { Terminal } from "./terminal/terminal";
import { TerminalSmall } from "./terminal/terminal-small";

function render(qrData, options, cb) {
  if (options?.small) {
    return TerminalSmall.render(qrData, options, cb);
  }
  return Terminal.render(qrData, options, cb);
}

export const RendererTerminal = {
  render,
};
