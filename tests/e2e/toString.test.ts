import path from "node:path";
import { describe, expect, it } from "vitest";
import { Qrex } from "../../src/qrex";

const baseOptions = {
  maskPattern: 0,
  version: 3,
};

describe("toString", () => {
  it("should throw if text is not provided", () => {
    expect(() => {
      const qrex: Qrex = new Qrex();
      qrex.toString();
    }).toThrow("String required as first argument");
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

describe("toString svg", () => {
  const file = path.join(__dirname, "/svgtag.expected.out");

  it("should return an error for invalid maskPattern with callback", () => {
    const qrex: Qrex = new Qrex("http://www.google.com");
    expect(() => qrex.toString()).toThrow("bad maskPattern:undefined");
  });

  it("should return an error for invalid maskPattern with promise", async () => {
    const qrex: Qrex = new Qrex("http://www.google.com");
    expect(() => qrex.toString()).toThrow("bad maskPattern:undefined");
  });

  it("should return an error for invalid version with callback", () => {
    const qrex: Qrex = new Qrex("http://www.google.com", { maskPattern: 0 });
    expect(() => qrex.toString()).toThrow("No valid version provided");
  });

  it("should return an error for invalid version with promise", async () => {
    const qrex: Qrex = new Qrex("http://www.google.com", { maskPattern: 0 });
    expect(() => qrex.toString()).toThrow("No valid version provided");
  });
});
