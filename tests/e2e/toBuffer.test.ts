import { describe, expect, it } from "vitest";
import { Qrex } from "../../src/qrex.js";

describe("toBuffer", () => {
  it("should not throw an error for the terminal renderer", async () => {
    const qrex: Qrex = new Qrex("http://www.google.com", { maskPattern: 0, version: 3, type: "terminal" });
    expect(() => qrex.toBuffer()).not.toThrow();
  });

  it("should throw an error for the SVG renderer", async () => {
    const qrex: Qrex = new Qrex("http://www.google.com", { maskPattern: 0, version: 3, type: "svg" });
    expect(() => qrex.toBuffer()).toThrow("Buffer is not supported for this renderer");
  });

  it("should throw an error for the UTF8 renderer", async () => {
    const qrex: Qrex = new Qrex("http://www.google.com", { maskPattern: 0, version: 3, type: "utf8" });
    expect(() => qrex.toBuffer()).toThrow("Buffer is not supported for this renderer");
  });
});
