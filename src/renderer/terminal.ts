import { type QRCodeToStringOptionsTerminal as QRCodeOptions, type QRCode } from "qrcode";
import { type Renderer } from "./utils";
import * as small from "./terminal/terminal-small";
import * as big from "./terminal/terminal";

class TerminalRenderer implements Renderer {

  render(qrData: QRCode, options: QRCodeOptions, cb?: Function): string {
    if (options?.small) {
      return small.render(qrData, options, cb);
    }
    return big.render(qrData, options, cb);
  }

}

export default new TerminalRenderer;
