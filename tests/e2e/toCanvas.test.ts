import { Canvas, createCanvas } from "canvas";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { QRex } from "../../src/browser";
import { RendererCanvas } from "../../src/renderer/canvas";
import type { QRexOptions } from "../../src/types/qrex.type";
import { removeNativePromise, restoreNativePromise } from "../helpers";

const defaultOptions = {
  maskPattern: 0,
  version: 1,
};

describe("toCanvas - no promise available", () => {
  let canvasEl: HTMLCanvasElement;
  let originalDocument: typeof global.document;

  beforeAll(() => {
    originalDocument = global.document;
    global.document = {
      createElement: (el: string): Canvas | undefined => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
        return undefined;
      },
    } as unknown as Document;
  });

  afterAll(() => {
    global.document = originalDocument;
  });

  it("should throw an error if no arguments are provided", () => {
    expect(() => {
      const qrex: QRex = new QRex("some text");
      qrex.toCanvas();
    }).toThrow("bad maskPattern:undefined");
  });

  it("should work with text and generate a canvas", () => {
    if (!canvasEl) return;
    const qrex: QRex = new QRex("test text", defaultOptions as QRexOptions, canvasEl);
    const canvas = qrex.toCanvas();

    expect(canvas).toBeDefined();
    expect(canvas).toHaveProperty("getContext");
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  it("should work with canvas, text and callback", () => {
    return new Promise((resolve) => {
      console.log("hello my nigga", canvasEl);
      const qrex: QRex = new QRex("test text", defaultOptions as QRexOptions, canvasEl);
      const canvas = qrex.toCanvas();
      expect(canvas).toBeDefined();
    });
  });

  it("should work with canvas, text, options and callback", () => {
    return new Promise((resolve) => {
      const options = { ...defaultOptions, width: 200 };
      toCanvas(canvasEl, "test text", options, (err, canvas) => {
        expect(err).toBeNull();
        expect(canvas).toBeDefined();
        resolve();
      });
    });
  });
});

describe("toCanvas Function Tests", () => {
  let canvasEl: Canvas | HTMLCanvasElement;

  beforeEach(() => {
    global.document = {
      createElement: (el) => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
      },
    };
    canvasEl = createCanvas(200, 200);
  });

  afterEach(() => {
    global.document = undefined;
  });

  describe("Basic Functionality", () => {
    it("should throw an error if no arguments are provided", () => {
      expect(() => {
        toCanvas();
      }).toThrow("Too few arguments provided");
    });

    it("should work with text and callback", () => {
      return new Promise((resolve) => {
        toCanvas("some text", defaultOptions, (err, canvas) => {
          expect(err).toBeNull();
          expect(canvas).toBeInstanceOf(Canvas);
          resolve();
        });
      });
    });

    it("should work with text, options, and callback", () => {
      return new Promise((resolve) => {
        const options = {
          ...defaultOptions,
          errorCorrectionLevel: "H",
        };
        toCanvas("some text", options, (err, canvas) => {
          expect(err).toBeNull();
          expect(canvas).toBeInstanceOf(Canvas);
          resolve();
        });
      });
    });
    it("should return a canvas object when using text with Promise", async () => {
      const canvas = await toCanvas("some text", defaultOptions);
      expect(canvas).toBeInstanceOf(Canvas);
    });

    it("should return a canvas object when using text and options with Promise", async () => {
      const options = {
        ...defaultOptions,
        errorCorrectionLevel: "H",
      };
      const canvas = await toCanvas("some text", options);
      expect(canvas).toBeInstanceOf(Canvas);
    });
  });

  describe("toCanvas with specified canvas element", () => {
    it("should work with canvas element, text, and callback", () => {
      return new Promise((resolve) => {
        toCanvas(canvasEl, "some text", defaultOptions, (err, canvas) => {
          expect(err).toBeNull();
          expect(canvas).toBeInstanceOf(Canvas);
          resolve();
        });
      });
    });

    it("should work with canvas element, text, options, and callback", () => {
      return new Promise((resolve) => {
        toCanvas(canvasEl, "some text", { errorCorrectionLevel: "H", maskPattern: 0 }, (err, canvas) => {
          expect(err).toBeNull();
          expect(canvas).toBeInstanceOf(Canvas);
          resolve();
        });
      });
    });

    it("should return a canvas object when using canvas element, text with Promise", async () => {
      const canvas = await toCanvas(canvasEl, "some text", defaultOptions);
      expect(canvas).toBeInstanceOf(Canvas);
    });

    it("should return a canvas object when using canvas element, text, and options with Promise", async () => {
      const canvas = await toCanvas(canvasEl, "some text", defaultOptions, {
        errorCorrectionLevel: "H",
      });
      expect(canvas).toBeInstanceOf(Canvas);
    });
  });
});
