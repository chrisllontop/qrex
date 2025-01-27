import fs from "node:fs";
import { Parser } from "htmlparser2";
import { describe, expect, it, vi, afterAll } from "vitest";
import { Qrex } from "../../../src/core/qrex";
import { RendererSvg } from "../../../src/renderer/svg";
import type { QRData } from "../../../src/types/qrex.type";

interface ExpectedTag {
  name: string;
  attribs: Array<{ name: string; value: string }>;
}

function getExpectedViewbox(size: number, margin: number): string {
  const expectedQrCodeSize = size + margin * 2;
  return `0 0 ${expectedQrCodeSize} ${expectedQrCodeSize}`;
}

const renderer: RendererSvg = new RendererSvg();

function testSvgFragment(svgFragment: string, expectedTags: ExpectedTag[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const parser = new Parser(
      {
        onopentag: (name: string, attribs: { [key: string]: string | undefined }) => {
          const tag = expectedTags.shift();
          if (!tag) return;

          expect(tag.name).toBe(name);
          for (const attr of tag.attribs) {
            expect(attribs[attr.name]?.toString()).toBe(attr.value.toString());
          }
        },

        onend: () => {
          resolve();
        },

        onerror: (e: Error) => {
          reject(e);
        },
      },
      { decodeEntities: true },
    );

    parser.write(svgFragment);
    parser.end();
  });
}

function buildTest(data: QRData, opts: unknown, expectedTags: ExpectedTag[]): Promise<void> {
  // @ts-ignore Testing with various option combinations
  const svg = renderer.render(data, opts);
  return testSvgFragment(svg, expectedTags.slice());
}

describe("SvgRenderer", () => {
  it("should have render function", () => {
    expect(renderer.render).toBeTypeOf("function");
  });

  it("should have renderToFile function", () => {
    expect(renderer.renderToFile).toBeTypeOf("function");
  });

  describe("Svg render", () => {
    const data: QRData = Qrex.create("sample text", { version: 2, maskPattern: 0 });
    const size = data.modules.size;

    it("should render SVG with scale 4 and margin 4", async () => {
      const expectedTags: ExpectedTag[] = [
        {
          name: "svg",
          attribs: [{ name: "viewbox", value: getExpectedViewbox(size, 4) }],
        },
        {
          name: "path",
          attribs: [
            { name: "fill", value: "#ffffff" },
            { name: "fill-opacity", value: ".50" },
          ],
        },
        {
          name: "path",
          attribs: [{ name: "stroke", value: "#000000" }],
        },
      ];

      await buildTest(
        data,
        {
          scale: 4,
          margin: 4,
          color: {
            light: "#ffffff80",
          },
        },
        expectedTags,
      );
    });

    it("should render SVG with scale 0 and margin 8", async () => {
      const expectedTags: ExpectedTag[] = [
        {
          name: "svg",
          attribs: [{ name: "viewbox", value: getExpectedViewbox(size, 8) }],
        },
        {
          name: "path",
          attribs: [
            { name: "stroke", value: "#000000" },
            { name: "stroke-opacity", value: ".50" },
          ],
        },
      ];

      await buildTest(
        data,
        {
          scale: 0,
          margin: 8,
          color: {
            light: "#0000",
            dark: "#00000080",
          },
        },
        expectedTags,
      );
    });

    it("should render SVG with default options", async () => {
      const expectedTags: ExpectedTag[] = [
        {
          name: "svg",
          attribs: [{ name: "viewbox", value: getExpectedViewbox(size, 4) }],
        },
        { name: "path", attribs: [{ name: "fill", value: "#ffffff" }] },
        { name: "path", attribs: [{ name: "stroke", value: "#000000" }] },
      ];

      await buildTest(data, {}, expectedTags);
    });

    it("should render SVG with width 250", async () => {
      const expectedTags: ExpectedTag[] = [
        {
          name: "svg",
          attribs: [
            { name: "width", value: "250" },
            { name: "height", value: "250" },
            { name: "viewbox", value: getExpectedViewbox(size, 4) },
          ],
        },
        { name: "path", attribs: [{ name: "fill", value: "#ffffff" }] },
        { name: "path", attribs: [{ name: "stroke", value: "#000000" }] },
      ];

      await buildTest(data, { width: 250 }, expectedTags);
    });
  });

  describe("Svg renderToFile", () => {
    const sampleQrData: QRData = Qrex.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const fileName = "qrimage.svg";

    afterAll(() => {
      // Clean up test file if it exists
      if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
      }
    });

    it("should render to file with correct filename and without error", async () => {
      // @ts-ignore Mock implementation doesn't need exact typing
      const writeFileMock = vi.fn((file: string, content: string, callback: (err?: Error) => void) => callback());
      // @ts-ignore Mock implementation doesn't need exact typing
      vi.spyOn(fs, "writeFile").mockImplementation(writeFileMock);

      // @ts-ignore Testing with callback
      await renderer.renderToFile(fileName, sampleQrData, (err?: Error) => {
        expect(err).toBeUndefined();
        expect(writeFileMock).toHaveBeenCalledWith(fileName, expect.any(String), expect.any(Function));
      });
    });

    it("should render to file with options and without error", async () => {
      // @ts-ignore Mock implementation doesn't need exact typing
      const writeFileMock = vi.fn((file: string, content: string, callback: (err?: Error) => void) => callback());
      // @ts-ignore Mock implementation doesn't need exact typing
      vi.spyOn(fs, "writeFile").mockImplementation(writeFileMock);

      // @ts-ignore Testing with margin and scale options
      await renderer.renderToFile(fileName, sampleQrData, { margin: 10, scale: 1 }, (err?: Error) => {
        expect(err).toBeUndefined();
        expect(writeFileMock).toHaveBeenCalledWith(fileName, expect.any(String), expect.any(Function));
      });
    });

    it("should fail if an error occurs during file save", async () => {
      // @ts-ignore Mock implementation doesn't need exact typing
      const writeFileMock = vi.fn((file: string, content: string, callback: (err?: Error) => void) =>
        callback(new Error("File error")),
      );
      // @ts-ignore Mock implementation doesn't need exact typing
      vi.spyOn(fs, "writeFile").mockImplementation(writeFileMock);

      // @ts-ignore Testing with callback
      await renderer.renderToFile(fileName, sampleQrData, (err?: Error) => {
        expect(err).toBeTruthy();
      });
    });
  });
});
