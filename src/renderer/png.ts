import fs from "fs";
import { PNG } from "pngjs";
import { getOptions, getImageWidth, qrToImageData } from "./utils";
import { type QRCode } from "qrcode";
import { type Stream } from "stream";
import { type ExtendedRendererOptions as RendererOptions, type Renderer } from "./utils";

class PngRenderer implements Renderer {

  render(qrData: QRCode, options: RendererOptions) {
    const opts = getOptions(options);
    const pngOpts = opts.rendererOpts;
    const size = getImageWidth(qrData.modules.size, opts);

    pngOpts.width = size;
    pngOpts.height = size;

    const pngImage = new PNG(pngOpts);

    qrToImageData(pngImage.data, qrData, opts);

    return pngImage;
  }

  renderToDataURL(qrData: QRCode, options: RendererOptions, cb: Function): void {
    this.renderToBuffer(qrData, options, (err, output) => {
      if (err) cb(err);
      let url = "data:image/png;base64,";
      url += output.toString("base64");
      cb(null, url);
    });
  }

  renderToBuffer(qrData: QRCode, options: RendererOptions, cb: Function): void {
    const png = this.render(qrData, options);
    const buffer = [];

    png.on("error", cb);
    png.on("data", data => {
      buffer.push(data);
    });

    png.on("end", () => {
      cb(null, Buffer.concat(buffer));
    });

    png.pack();
  }

  renderToFile(path: string, qrData: QRCode, options: RendererOptions, cb: Function): void {
    let called = false;
    const done = (...args) => {
      if (called) return;
      called = true;
      cb.apply(null, args);
    };
    const stream = fs.createWriteStream(path);

    stream.on("error", done);
    stream.on("close", done);

    this.renderToFileStream(stream, qrData, options);
  }

  renderToFileStream(
    stream: Stream,
    qrData: QRCode,
    options: RendererOptions,
  ): void {
    const png = this.render(qrData, options);
    png.pack().pipe(stream);
  }

}

export default new PngRenderer;
