// @ts-nocheck
import fs from "node:fs";
import htmlparser from "htmlparser2";
import { describe, expect, it, vi } from "vitest";
import { QRex as QRCode } from "../../../src/core/qrex";
import { RendererSvg } from "../../../src/renderer/svg";

const renderobject = new RendererSvg();
function getExpectedViewbox(size, margin) {
  const expectedQrCodeSize = size + margin * 2;
  return `0 0 ${expectedQrCodeSize} ${expectedQrCodeSize}`;
}

function testSvgFragment(svgFragment, expectedTags) {
  return new Promise((resolve, reject) => {
    const parser = new htmlparser.Parser(
      {
        onopentag: (name, attribs) => {
          const tag = expectedTags.shift();

          expect(tag.name).toBe(name);
          for (const attr of tag.attribs) {
            expect(attribs[attr.name]?.toString()).toBe(attr.value.toString());
          }
        },

        onend: () => {
          //@ts-ignore
          resolve();
        },

        onerror: (e) => {
          reject(e);
        },
      },
      { decodeEntities: true },
    );

    parser.write(svgFragment);
    parser.end();
  });
}

function buildTest(data, opts, expectedTags) {
  const svg = renderobject.render(data, opts);
  return testSvgFragment(svg, expectedTags.slice());
}

describe("SvgRenderer", () => {
  it("should have render function", () => {
    expect(renderobject.render).toBeTypeOf("function");
  });

  it("should have renderToFile function", () => {
    expect(renderobject.renderToFile).toBeTypeOf("function");
  });

  describe("Svg render", () => {
    const data = QRCode.create("sample text", { version: 2, maskPattern: 0 });
    const size = data.modules.size;

    it("should render SVG with scale 4 and margin 4", async () => {
      const expectedTags = [
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
      const expectedTags = [
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
      const expectedTags = [
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
      const expectedTags = [
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
    const sampleQrData = QRCode.create("sample text", {
      version: 2,
      maskPattern: 0,
    });
    const fileName = "qrimage.svg";

    it("should render to file with correct filename and without error", async () => {
      const writeFileMock = vi.fn((file, content, callback) => callback());

      vi.spyOn(fs, "writeFile").mockImplementation(writeFileMock);
      renderobject.renderToFile(fileName, sampleQrData, (err) => {
        expect(err).toBeNull;
      });
    });

    it("should render to file with options and without error", async () => {
      const writeFileMock = vi.fn((file, content, callback) => callback());

      vi.spyOn(fs, "writeFile").mockImplementation(writeFileMock);

      renderobject.renderToFile(fileName, sampleQrData, { margin: 10, scale: 1 }, (err) => {
        expect(err).toBeNull;
      });
    });

    it("should fail if an error occurs during file save", async () => {
      const writeFileMock = vi.fn((file, content, callback) => callback(new Error("File error")));

      vi.spyOn(fs, "writeFile").mockImplementation(writeFileMock);

      renderobject.renderToFile(fileName, sampleQrData, (err) => {
        expect(err).toBeNull;
      });
    });
  });
});
