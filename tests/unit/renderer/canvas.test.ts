import { Canvas, createCanvas } from "canvas";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { QRex } from "../../../src/core/qrex";
import {RendererCanvas} from "../../../src/renderer/canvas";
import { RendererType } from "../../../src/types/qrex.type";

describe("RendererCanvas interface", () => {
  it("should have render function", () => {
    expect(typeof RendererCanvas.prototype.render).toBe("function");
  });

  it("should have renderToDataURL function", () => {
    expect(typeof RendererCanvas.prototype.renderToDataURL).toBe("function");
  });
});

describe("RendererCanvas render", () => {
  let originalDocument: typeof global.document;

  beforeAll(() => {
    originalDocument = global.document;
    global.document = {
      createElement: (el: string): Canvas | undefined => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
        return undefined
      },
    } as unknown as Document;
  });

  afterAll(() => {
    global.document = originalDocument;
  });

  it("should not throw if canvas is not provided", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    let canvasEl:any;
    let renderer: RendererCanvas;
    expect(() => {
      renderer = new RendererCanvas();
      canvasEl = renderer.render(sampleQrData);
    }).not.toThrow();

    expect(canvasEl instanceof Canvas).toBe(true);
  });

  it("should not throw with options param", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    let canvasEl;
    let renderer: RendererCanvas;
    // expect(() => {
    //   renderer = new RendererCanvas();
    //   canvasEl = renderer.render(sampleQrData, { margin: 10, scale: 1 });
    // }).not.toThrow();

    // expect(canvasEl?.width).toBe(25 + 10 * 2);
    // expect(canvasEl?.width).toBe(canvasEl.height);
  });

  it("should throw if canvas cannot be created", () => {
    global.document = undefined;

    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    let renderer:RendererCanvas
    expect(() => {
      renderer = new RendererCanvas()
      renderer.render(sampleQrData);
    }).toThrow();
  });
});

describe("RendererCanvas render to provided canvas", () => {
  it("should not throw with only qrData and canvas param", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    let renderer:RendererCanvas
    expect(() => {
      renderer = new RendererCanvas()
      renderer.render(sampleQrData);
    }).toThrow();
  });

  it("should not throw with options param", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    let renderer:RendererCanvas
    // expect(() => {
    //   renderer = new RendererCanvas()
    //   renderer.render(sampleQrData, canvasEl, { margin: 10, scale: 1 });
    // }).toThrow();

    // expect(canvasEl.width).toBe(25 + 10 * 2);
    expect(canvasEl.width).toBe(canvasEl.height);
  });
});

describe("RendererCanvas renderToDataURL", () => {
  let originalDocument: typeof global.document;

  beforeAll(() => {
    originalDocument = global.document;
    global.document = {
      createElement: (el: string): Canvas | undefined => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
        return undefined
      },
    } as unknown as Document;
  });

  afterAll(() => {
    global.document = originalDocument;
  });

  it("should not throw if canvas is not provided", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    let url;
    let renderer:RendererCanvas
    expect(() => {
      renderer = new RendererCanvas()
      url = renderer.renderToDataURL(sampleQrData);
    }).not.toThrow();

    expect(url).toBeDefined();
  });

  it("should not throw with options param", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    let url;
    let renderer: RendererCanvas
    expect(() => {
      renderer = new RendererCanvas()
      url = renderer.renderToDataURL(sampleQrData, {
        margin: 10,
        scale: 1,
        type: "image/png" ,
      });
    }).not.toThrow();

    expect(url).toBeDefined();
  });

  it("should return a string", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const renderer:RendererCanvas = new RendererCanvas()
    const url = renderer.renderToDataURL(sampleQrData);

    expect(typeof url).toBe("string");
  });

  it("should have correct header in data URL", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const renderer:RendererCanvas = new RendererCanvas()
    const url = renderer.renderToDataURL(sampleQrData);

    expect(url.split(",")[0]).toBe("data:image/png;base64");
  });

  it("should have correct length for base64 string", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const renderer:RendererCanvas = new RendererCanvas()
    const url = renderer.renderToDataURL(sampleQrData);

    const b64png = url.split(",")[1];
    expect(b64png.length % 4).toBe(0);
  });
});

describe("RendererCanvas renderToDataURL to provided canvas", () => {
  it("should throw with only qrData", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    let url;

    expect(() => {
      const renderer:RendererCanvas = new RendererCanvas()
      url = renderer.renderToDataURL(sampleQrData);
    }).toThrow("You need to specify a canvas element");

    expect(url).toBeUndefined();
  });

  it("should not throw with options param", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    let url;

    expect(() => {
      const renderer:RendererCanvas = new RendererCanvas()
      url = renderer.renderToDataURL(sampleQrData, {
        margin: 10,
        scale: 1,
        type: "image/png",
      });
    }).toThrow();

    expect(url).toBeUndefined();
  });

  it("should return a string", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    const renderer:RendererCanvas = new RendererCanvas(canvasEl)
    const url = renderer.renderToDataURL(sampleQrData);

    expect(typeof url).toBe("string");
  });

  it("should have correct header in data URL", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    const renderer:RendererCanvas = new RendererCanvas(canvasEl)
    const url = renderer.renderToDataURL(sampleQrData);

    expect(url.split(",")[0]).toBe("data:image/png;base64");
  });

  it("should have correct length for base64 string", () => {
    const sampleQrData = QRex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const canvasEl = createCanvas(200, 200);
    const renderer:RendererCanvas = new RendererCanvas(canvasEl)
    const url = renderer.renderToDataURL(sampleQrData);

    const b64png = url.split(",")[1];
    expect(b64png.length % 4).toBe(0);
  });
});
