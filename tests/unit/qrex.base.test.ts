import { describe, expect, it } from "vitest";
import { QrexBase } from "../../src/qrex.base.js";

// Create a concrete class for testing the abstract QrexBase
class TestQrex extends QrexBase {}

describe("QrexBase", () => {
  describe("constructor validation", () => {
    it("Should throw error when invalid mask pattern is provided", () => {
      // Test negative value
      expect(
        () =>
          new TestQrex("test", {
            version: 1,
            maskPattern: -1,
          }),
      ).toThrow("Mask pattern must be an integer between 0 and 7");

      // Test value greater than 7
      expect(
        () =>
          new TestQrex("test", {
            version: 1,
            maskPattern: 8,
          }),
      ).toThrow("Mask pattern must be an integer between 0 and 7");

      // Test non-integer value
      expect(
        () =>
          new TestQrex("test", {
            version: 1,
            maskPattern: 1.5,
          }),
      ).toThrow("Mask pattern must be an integer between 0 and 7");
    });
  });
});
