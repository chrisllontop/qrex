import * as big from "./terminal/terminal";
import * as small from "./terminal/terminal-small";

export function render(qrData, options, cb) {
  if (options?.small) {
    return small.render(qrData, options, cb);
  }
  return big.render(qrData, options, cb);
}
