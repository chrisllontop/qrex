/* global QRCode */
import to_sjis from "./to-sjis";

interface QRCode {
  toSJIS: (data: string) => number | undefined;
}

declare const QRCode: QRCode;

QRCode.toSJIS = to_sjis;
