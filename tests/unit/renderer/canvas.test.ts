// @ts-nocheck
import { Canvas, createCanvas } from "canvas";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { QRex as QRCode } from "../../../src/core/qrex";
import { RendererCanvas } from "../../../src/renderer/canvas";
import { QRData, QRexOptions } from "../../../src/types/qrex.type";

const rendererCanvas = new RendererCanvas();
describe("RendererCanvas interface", () => {
  it("should have render function", () => {
    expect(typeof rendererCanvas.render).toBe("function");
  });

  it("should have renderToDataURL function", () => {
    expect(typeof rendererCanvas.renderToDataURL).toBe("function");
  });
});

describe("RendererCanvas render", () => {
  let originalDocument: Document;

  beforeAll(() => {
    originalDocument = global.document;
    global.document = {
      createElement: (el) => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
      },
    } as unknown as Document;
  });

  afterAll(() => {
    global.document = originalDocument;
  });

  it("should not throw if canvas is not provided", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    let canvasEl: HTMLCanvasElement;

    expect(() => {
      canvasEl = rendererCanvas.render(sampleQrData);
    }).not.toThrow();

    expect(canvasEl instanceof Canvas).toBe(true);
  });

  it("should not throw with options param", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    let canvasEl: HTMLCanvasElement;

    expect(() => {
      canvasEl = rendererCanvas.render(sampleQrData, { margin: 10, scale: 1 });
    }).not.toThrow();

    expect(canvasEl.width).toBe(25 + 10 * 2);
    expect(canvasEl.width).toBe(canvasEl.height);
  });

  it("should throw if canvas cannot be created", () => {
    global.document = undefined as unknown as Document;

    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    expect(() => {
      rendererCanvas.render(sampleQrData);
    }).toThrow();
  });
});

describe("RendererCanvas render to provided canvas", () => {
  it("should not throw with only qrData and canvas param", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);

    expect(() => {
      rendererCanvas.render(sampleQrData, canvasEl);
    }).not.toThrow();
  });

  it("should not throw with options param", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);

    expect(() => {
      rendererCanvas.render(sampleQrData, canvasEl, { margin: 10, scale: 1 });
    }).not.toThrow();

    expect(canvasEl.width).toBe(25 + 10 * 2);
    expect(canvasEl.width).toBe(canvasEl.height);
  });
});

describe("RendererCanvas renderToDataURL", () => {
  let originalDocument: Document;

  beforeAll(() => {
    originalDocument = global.document;
    global.document = {
      createElement: (el) => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
      },
    } as unknown as Document;
  });

  afterAll(() => {
    global.document = originalDocument;
  });

  it("should not throw if canvas is not provided", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    let url: string;

    expect(() => {
      url = rendererCanvas.renderToDataURL(sampleQrData);
    }).not.toThrow();

    expect(url).toBeDefined();
  });

  it("should not throw with options param", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    let url: string;

    expect(() => {
      url = rendererCanvas.renderToDataURL(sampleQrData, {
        margin: 10,
        scale: 1,
        type: "image/png",
      });
    }).not.toThrow();

    expect(url).toBeDefined();
  });

  it("should return a string", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const url = rendererCanvas.renderToDataURL(sampleQrData);

    expect(typeof url).toBe("string");
  });

  it("should have correct header in data URL", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const url = rendererCanvas.renderToDataURL(sampleQrData);

    expect(url.split(",")[0]).toBe("data:image/png;base64");
  });

  it("should have correct length for base64 string", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const url = rendererCanvas.renderToDataURL(sampleQrData);

    const b64png = url.split(",")[1];
    expect(b64png.length % 4).toBe(0);
  });
});

describe("RendererCanvas renderToDataURL to provided canvas", () => {
  it("should not throw with only qrData and canvas param", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    let url: string;

    expect(() => {
      url = rendererCanvas.renderToDataURL(sampleQrData, canvasEl);
    }).not.toThrow();

    expect(url).toBeDefined();
  });

  it("should not throw with options param", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    let url: string;

    expect(() => {
      url = rendererCanvas.renderToDataURL(sampleQrData, canvasEl, {
        margin: 10,
        scale: 1,
        type: "image/png",
      });
    }).not.toThrow();

    expect(url).toBeDefined();
  });

  it("should return a string", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    const url = rendererCanvas.renderToDataURL(sampleQrData, canvasEl);

    expect(typeof url).toBe("string");
  });

  it("should have correct header in data URL", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    const url = rendererCanvas.renderToDataURL(sampleQrData, canvasEl);

    expect(url.split(",")[0]).toBe("data:image/png;base64");
  });

  it("should have correct length for base64 string", () => {
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    const url = rendererCanvas.renderToDataURL(sampleQrData, canvasEl);

    const b64png = url.split(",")[1];
    expect(b64png.length % 4).toBe(0);
  });
});
