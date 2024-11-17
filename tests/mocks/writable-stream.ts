import stream from "stream";
import util from "util";

function WritableStream(): void {
  stream.Writable.call(this);
  this.forceError = false;

  this.once("finish", () => {
    this.close();
  });
}

util.inherits(WritableStream, stream.Writable);

WritableStream.prototype._write = (data: string, encoding: string, cb: Function) => {
  if (this.forceError) this.emit("error", new Error("Fake error"));
  cb(this.forceError || null);
};

WritableStream.prototype.close = (cb: Function) => {
  this.emit("close");
  if (cb) cb();
};

WritableStream.prototype.forceErrorOnWrite = () => {
  this.forceError = true;
  return this;
};

export default WritableStream;
