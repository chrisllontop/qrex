import { Writable, type WritableOptions } from "node:stream";

class WritableStream extends Writable {
  private forceError: boolean;

  constructor(options?: WritableOptions) {
    super(options);
    this.forceError = false;

    this.once("finish", () => {
      this.close();
    });
  }

  _write(chunk: unknown, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    if (this.forceError) this.emit("error", new Error("Fake error"));
    callback(this.forceError ? new Error("Fake error") : null);
  }

  close(callback?: () => void): void {
    this.emit("close");
    if (callback) callback();
  }

  forceErrorOnWrite(): this {
    this.forceError = true;
    return this;
  }
}

export default WritableStream;
