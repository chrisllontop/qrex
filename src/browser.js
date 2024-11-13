import canPromise from "./can-promise";
import { QRCode } from "./core/qrcode";
import { RendererCanvas } from "./renderer/canvas";
import { RendererSvgTag } from "./renderer/svg-tag.js";

function renderCanvas(renderFunc, ...args) {
  const argsNum = args.length;
  const isLastArgCb = typeof args[argsNum - 1] === "function";

  let canvas;
  let text;
  let opts;
  let cb;

  if (!isLastArgCb && !canPromise()) {
    throw new Error("Callback required as last argument");
  }

  if (isLastArgCb) {
    cb = args[argsNum - 1];

    if (argsNum < 2) {
      throw new Error("Too few arguments provided");
    }

    if (argsNum === 2) {
      // Case: (text, cb)
      text = args[0];
      canvas = opts = undefined;
    } else if (argsNum === 3) {
      if (canvas.getContext && typeof cb === "undefined") {
        // Case: (canvas, text, cb)
        canvas = args[0];
        text = args[1];
        cb = args[2];
        opts = undefined;
      } else {
        // Case: (text, opts, cb)
        text = args[0];
        opts = args[1];
        canvas = undefined;
      }
    }
  } else {
    if (argsNum < 1) {
      throw new Error("Too few arguments provided");
    }

    if (argsNum === 1) {
      text = args[0];
      canvas = opts = undefined;
    } else if (argsNum === 2 && !args[0].getContext) {
      // Case: (text, opts)
      text = args[0];
      opts = args[1];
      canvas = undefined;
    } else {
      // Case: (canvas, text)
      canvas = args[0];
      text = args[1];
      opts = undefined;
    }

    return new Promise((resolve, reject) => {
      try {
        const data = create(text, opts);
        resolve(renderFunc(data, canvas, opts));
      } catch (e) {
        reject(e);
      }
    });
  }

  try {
    const data = create(text, opts);
    cb(null, renderFunc(data, canvas, opts));
  } catch (e) {
    cb(e);
  }
}

export const create = QRCode.create;
export const toCanvas = renderCanvas.bind(null, RendererCanvas.render);
export const toDataURL = renderCanvas.bind(
  null,
  RendererCanvas.renderToDataURL,
);

const renderToString = renderCanvas.bind(null, (data, _, opts) =>
  RendererSvgTag.render(data, opts),
);

export { renderToString as toString };
