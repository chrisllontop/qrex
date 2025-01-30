import { describe, expect, it } from "vitest";
import { Qrex } from "../../src/qrex.js";

describe("toString", () => {
  it("should throw if text is not provided", () => {
    expect(() => {
      // @ts-ignore Testing missing required parameters
      const qrex: Qrex = new Qrex();
      qrex.toString();
    }).toThrow("QR code content is required. Please provide a non-empty string to encode in the QR code");
  });

  it("should not throw an error for valid SVG renderer", async () => {
    const qrex: Qrex = new Qrex("http://www.google.com", { maskPattern: 0, version: 3, type: "svg" });
    expect(() => qrex.toString()).not.toThrow();
  });

  it("should not throw an error for valid UTF8 renderer", async () => {
    const qrex: Qrex = new Qrex("http://www.google.com", { maskPattern: 0, version: 3, type: "txt" });
    expect(() => qrex.toString()).not.toThrow();
  });

  it("should not throw an error for valid terminal renderer", async () => {
    const qrex: Qrex = new Qrex("http://www.google.com", { maskPattern: 0, version: 3, type: "terminal" });
    expect(() => qrex.toString()).not.toThrow();
  });
});
