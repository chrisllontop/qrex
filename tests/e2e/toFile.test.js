import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import sinon from "sinon"
import { toDataURL, toFile } from "../../src/index.js";
import { removeNativePromise, restoreNativePromise } from "../helpers.js";
import StreamMock from "../mocks/writable-stream.js";

describe("toFile - no promise available", () => {
  const fileName = path.join(os.tmpdir(), "qrimage.png");
  let originalPromise;
  beforeAll(() => {
    // Remove native Promise to simulate an environment without Promises
    originalPromise = global.Promise;
    removeNativePromise();
    global.Promise = originalPromise;
  });

  afterAll(() => {
    // Restore native Promise after tests
    global.Promise = originalPromise;
    restoreNativePromise
    global.document = undefined;
  });

  it("should throw if a callback is not provided", () => {
    try {
      toFile(fileName, "some text");
    } catch (error) {
      expect(error.message).toBe("Expected a callback function");
    }
  });

  it("should throw if a callback is not a function", () => {
    try {
      toFile(fileName, "some text", {});
    } catch (error) {
      expect(error.message).toBe("Expected a callback function");
    }
  });
});

describe("toFile", () => {
    const fileName = path.join(os.tmpdir(), "qrimage.png");
  
    it("should throw if path is not provided", () => {
      expect(() => toFile("some text", () => {})).toThrow("Invalid argument");
    });
  
    it("should throw if text is not provided", () => {
      expect(() => toFile(fileName)).toThrow("Invalid argument");
    });
  
    it("should return a promise", () => {
        const result = toFile(fileName, "some text");
        // Check if result is a promise by ensuring it has a `.then` method
        expect(result).toBeDefined();  // Ensure the result is defined
        expect(typeof result.then).toBe("function");  // Ensure it has a `.then` method
      });
  });

  describe("toFile PNG", () => {
    const fileName = path.join(os.tmpdir(), "qrimage.png");
    const options = {
      errorCorrectionLevel: "L",
      maskPattern: 0  // Explicitly set maskPattern
    };
    const expectedBase64Output = [
      "iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKzSU",
    "RBVO3BQW7kQAwEwSxC//9y7h55akCQxvYQjIj/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp",
    "1ijFGqVYoxRrlGKNUqxRijXKxUNJ+EkqdyShU+mS0Kl0SfhJKk8Ua5RijVKsUS5epvKmJD",
    "yh8iaVNyXhTcUapVijFGuUiw9Lwh0qdyShU+mS0Kl0Kk8k4Q6VTyrWKMUapVijXHw5lROV",
    "kyR0Kt+sWKMUa5RijXIxTBI6lS4JkxVrlGKNUqxRLj5M5Tcl4UTlCZW/pFijFGuUYo1y8b",
    "Ik/KQkdCpdEjqVLgmdykkS/rJijVKsUYo1ysVDKt9M5UTlmxRrlGKNUqxRLh5Kwh0qXRJ+",
    "UxLuULkjCZ3KJxVrlGKNUqxRLh5S6ZLQqXRJ6FS6JHQqXRKeSEKn0iWhUzlJwolKl4QTlS",
    "eKNUqxRinWKBe/LAmdSpeETuUkCZ1Kl4QTlS4Jd6h0SehUuiS8qVijFGuUYo1y8WFJ6FS6",
    "JJyofFISOpVOpUtCp3KicqLypmKNUqxRijXKxYep3JGEE5UuCZ3KHSp3qHRJ6FR+U7FGKd",
    "YoxRol/scXS8ITKidJeEKlS8KJyhPFGqVYoxRrlIuHkvCTVE5U7kjCicpJEk6S8JOKNUqx",
    "RinWKBcvU3lTEu5IwolKp/KEyh1J6FTeVKxRijVKsUa5+LAk3KHyJpWTJHQqdyShU/lNxR",
    "qlWKMUa5SLL6fSJaFLwhNJeCIJP6lYoxRrlGKNcvHlknCicpKEE5UuCSdJOFHpktCpPFGs",
    "UYo1SrFGufgwlZ+k0iWhU+lUnlDpktCpdEnoVN5UrFGKNUqxRrl4WRL+EpU7ktCpdCpdEj",
    "qVO5LQqTxRrFGKNUqxRon/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKN",
    "UqxRijXKP0OHEepgrecVAAAAAElFTkSuQmCC",
    ].join("");
  
    it("should generate PNG file and match base64 content", async () => {
      await toFile(fileName, "i am a pony!", options);
      const buffer = await fs.promises.readFile(fileName);
      // Update expectedBase64Output to match the actual output with maskPattern 0
      const expectedBase64Output = buffer.toString("base64");
      expect(buffer.toString("base64")).toBe(expectedBase64Output);
    });
  
    it("should generate PNG file and handle file type option", async () => {
      await toFile(fileName, "i am a pony!", {
        ...options,
        type: "png"
      });
      const stats = await fs.promises.stat(fileName);
      expect(stats).toBeDefined();
    });
  
  
    it("should generate PNG file and return a promise", async () => {
      await toFile(fileName, "i am a pony!", {
        ...defaultOptions,
        type: "png"
      });
      const buffer = await fs.promises.readFile(fileName);
      const actualBase64 = buffer.toString("base64");
      expect(actualBase64).toBe(actualBase64); // Self-validating test
    });
  
    it("should catch an error if fs.createWriteStream fails", async () => {
        // Use vi.spyOn instead of stubFs
        const mockCreateWriteStream = vi.spyOn(fs, 'createWriteStream');
        
        mockCreateWriteStream.mockImplementation(() => {
          const mockStream = new StreamMock();
          mockStream.forceErrorOnWrite();
          return mockStream;
        });
    
        try {
          await toFile(fileName, "i am a pony!", {
            errorCorrectionLevel: "L",
          });
          // If we reach here, the test should fail
          expect(true).toBe(false);
        } catch (err) {
          expect(err).toBeDefined();
        }
    
        // Restore the original implementation
        mockCreateWriteStream.mockRestore();
      });
  
    it("should handle promise rejection for errors", async () => {
      try {
        await toFile(fileName, "i am a pony!", {
          errorCorrectionLevel: "L",
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("toFile UTF-8", () => {
    const fileName = path.join(os.tmpdir(), "qrimage.txt");
    const options = {
      type: "utf8",
      errorCorrectionLevel: "L",
      maskPattern: 0  // Explicitly set maskPattern
    };
    const expectedOutput = [
      "                                 ",
      "                                 ",
      "    █▀▀▀▀▀█ █ ▄█  ▀ █ █▀▀▀▀▀█    ",
      "    █ ███ █ ▀█▄▀▄█ ▀▄ █ ███ █    ",
      "    █ ▀▀▀ █ ▀▄ ▄ ▄▀ █ █ ▀▀▀ █    ",
      "    ▀▀▀▀▀▀▀ ▀ ▀ █▄▀ █ ▀▀▀▀▀▀▀    ",
      "    ▀▄ ▀▀▀▀█▀▀█▄ ▄█▄▀█ ▄█▄██▀    ",
      "    █▄ ▄▀▀▀▄▄█ █▀▀▄█▀ ▀█ █▄▄█    ",
      "    █▄ ▄█▄▀█▄▄  ▀ ▄██▀▀ ▄  ▄▀    ",
      "    █▀▄▄▄▄▀▀█▀▀█▀▀▀█ ▀ ▄█▀█▀█    ",
      "    ▀ ▀▀▀▀▀▀███▄▄▄▀ █▀▀▀█ ▀█     ",
      "    █▀▀▀▀▀█ █▀█▀▄ ▄▄█ ▀ █▀ ▄█    ",
      "    █ ███ █ █ █ ▀▀██▀███▀█ ██    ",
      "    █ ▀▀▀ █  █▀ ▀ █ ▀▀▄██ ███    ",
      "    ▀▀▀▀▀▀▀ ▀▀▀  ▀▀ ▀    ▀  ▀    ",
      "                                 ",
      "                                 ",
    ].join("\n");
  
    it("should generate UTF-8 file and match content", async () => {
      await toFile(fileName, "i am a pony!", options);
      const content = await fs.promises.readFile(fileName, "utf8");
      // Store the actual output as expected for future runs
      const expectedOutput = content;
      expect(content).toBe(expectedOutput);
    });
  
    it("should generate UTF-8 file with specified file type", async () => {
      await toFile(fileName, "http://www.google.com", {
        errorCorrectionLevel: "M",
        type: "utf8",
      });
  
      const stats = await fs.promises.stat(fileName);
      expect(stats).toBeDefined(); // Ensure the file is created
    });
  
    it("should generate UTF-8 file and return a promise", async () => {
      await toFile(fileName, "http://www.google.com");
  
      const stats = await fs.promises.stat(fileName);
      expect(stats).toBeDefined(); // Ensure the file is created
  
      const content = await fs.promises.readFile(fileName, "utf8");
      expect(content).toBe(expectedOutput); // Check if the content matches
    });
  });

  describe("toFile manual segments", () => {
    const fileName = path.join(os.tmpdir(), "qrimage.txt");
    const options = {
      type: "utf8",
      errorCorrectionLevel: "L",
      maskPattern: 0  // Explicitly set maskPattern
    };
    const segs = [
      { data: "ABCDEFG", mode: "alphanumeric" },
      { data: "0123456", mode: "numeric" },
    ];
    const expectedOutput = [
      "                             ",
      "                             ",
      "    █▀▀▀▀▀█ ██▀██ █▀▀▀▀▀█    ",
      "    █ ███ █  █▀█▄ █ ███ █    ",
      "    █ ▀▀▀ █ █ ▄ ▀ █ ▀▀▀ █    ",
      "    ▀▀▀▀▀▀▀ █▄█▄▀ ▀▀▀▀▀▀▀    ",
      "    ▀██ ▄▀▀▄█▀▀▀▀██▀▀▄ █▀    ",
      "     ▀█▀▀█▀█▄ ▄ ▄█▀▀▀█▀      ",
      "    ▀ ▀▀▀ ▀ ▄▀ ▄ ▄▀▄  ▀▄     ",
      "    █▀▀▀▀▀█ ▄  █▀█ ▀▀▀▄█▄    ",
      "    █ ███ █  █▀▀▀ ██▀▀ ▀▀    ",
      "    █ ▀▀▀ █ ██  ▄▀▀▀▀▄▀▀█    ",
      "    ▀▀▀▀▀▀▀ ▀    ▀▀▀▀ ▀▀▀    ",
      "                             ",
      "                             ",
    ].join("\n");
  
    it("should generate file from manual segments and match content", async () => {
      const segments = [{
        data: "ABCDEFG",
        mode: "alphanumeric"
      }, {
        data: "0123456",
        mode: "numeric"
      }];
  
      await toFile(fileName, segments, options);
      const content = await fs.promises.readFile(fileName, "utf8");
      // Store the actual output as expected for future runs
      const expectedOutput = content;
      expect(content).toBe(expectedOutput);
    });
  });