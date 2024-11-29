import { type Canvas, createCanvas } from "canvas";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { QRex } from "../../src/qrex.browser";
import type { QRexOptions } from "../../src/types/qrex.type";

const defaultOptions = {
  maskPattern: 0,
  version: 1,
};

describe("QRex toCanvas Feature", () => {
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

  beforeEach(() => {
    canvasEl = createCanvas(200, 200);
  });

  afterEach(() => {
    canvasEl = null;
  });

  it("should throw an error if no arguments are provided", () => {
    expect(() => {
      const qrex: QRex = new QRex("some text");
      qrex.toCanvas();
    }).toThrow("bad maskPattern:undefined");
  });

  it("should work with text and generate a canvas", () => {
    console.log("from test", canvasEl);
    const qrex: QRex = new QRex("test text", defaultOptions as QRexOptions, canvasEl);
    const canvas = qrex.toCanvas();

    expect(canvas).toBeDefined();
    expect(canvas).toHaveProperty("getContext");
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  it("should work with canvas, text and callback", () => {
    return new Promise((resolve) => {
      const qrex: QRex = new QRex("test text", defaultOptions as QRexOptions, canvasEl);
      const canvas = qrex.toCanvas();
      expect(canvas).toBeDefined();
      resolve();
    });
  });

  it("should work with canvas, text, options and callback", () => {
    return new Promise((resolve) => {
      const options = { ...defaultOptions, width: 200 };
      const qrex: QRex = new QRex("test text", options as QRexOptions, canvasEl);
      const canvas = qrex.toCanvas();
      expect(canvas).toBeDefined();
      resolve();
    });
  });
});
