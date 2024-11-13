function hex2rgba(hex) {
  const hexString = typeof hex === "number" ? hex.toString() : hex;
  // if (typeof hex === "number") {
  //   hex = hex.toString();
  // }

  if (typeof hexString !== "string") {
    throw new Error("Color should be defined as hex string");
  }

  let hexCode = hexString.slice().replace("#", "").split("");
  if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
    throw new Error(`Invalid hex color: ${hexString}`);
  }

  // Convert from short to long form (fff -> ffffff)
  if (hexCode.length === 3 || hexCode.length === 4) {
    hexCode = Array.prototype.concat.apply(
      [],
      hexCode.map((c) => [c, c]),
    );
  }

  // Add default alpha value
  if (hexCode.length === 6) hexCode.push("F", "F");

  const hexValue = Number.parseInt(hexCode.join(""), 16);

  return {
    r: (hexValue >> 24) & 255,
    g: (hexValue >> 16) & 255,
    b: (hexValue >> 8) & 255,
    a: hexValue & 255,
    hex: `#${hexCode.slice(0, 6).join("")}`,
  };
}

function getOptions(options) {
  const resolvedOptions = options || {};
  if (!resolvedOptions.color) resolvedOptions.color = {};

  const margin =
    typeof resolvedOptions.margin === "undefined" ||
    resolvedOptions.margin === null ||
    resolvedOptions.margin < 0
      ? 4
      : resolvedOptions.margin;

  const width =
    resolvedOptions.width && resolvedOptions.width >= 21 ? resolvedOptions.width : undefined;
  const scale = resolvedOptions.scale || 4;

  return {
    width: width,
    scale: width ? 4 : scale,
    margin: margin,
    color: {
      dark: hex2rgba(resolvedOptions.color.dark || "#000000ff"),
      light: hex2rgba(resolvedOptions.color.light || "#ffffffff"),
    },
    type: resolvedOptions.type,
    rendererOpts: resolvedOptions.rendererOpts || {},
  };
}

function getScale(qrSize, opts) {
  return opts.width && opts.width >= qrSize + opts.margin * 2
    ? opts.width / (qrSize + opts.margin * 2)
    : opts.scale;
}

function getImageWidth(qrSize, opts) {
  const scale = getScale(qrSize, opts);
  return Math.floor((qrSize + opts.margin * 2) * scale);
}

function qrToImageData(imgData, qr, opts) {
  const size = qr.modules.size;
  const data = qr.modules.data;
  const scale = getScale(size, opts);
  const symbolSize = Math.floor((size + opts.margin * 2) * scale);
  const scaledMargin = opts.margin * scale;
  const palette = [opts.color.light, opts.color.dark];

  for (let i = 0; i < symbolSize; i++) {
    for (let j = 0; j < symbolSize; j++) {
      let posDst = (i * symbolSize + j) * 4;
      let pxColor = opts.color.light;

      if (
        i >= scaledMargin &&
        j >= scaledMargin &&
        i < symbolSize - scaledMargin &&
        j < symbolSize - scaledMargin
      ) {
        const iSrc = Math.floor((i - scaledMargin) / scale);
        const jSrc = Math.floor((j - scaledMargin) / scale);
        pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
      }

      imgData[posDst++] = pxColor.r;
      imgData[posDst++] = pxColor.g;
      imgData[posDst++] = pxColor.b;
      imgData[posDst] = pxColor.a;
    }
  }
}

export const RendererUtils = {
  getOptions,
  getImageWidth,
  qrToImageData,
};
