const stream = require("stream");
const util = require("util");

function WritableStream() {
  stream.Writable.call(this);
  this.forceError = false;

  this.once("finish", () => {
    this.close();
  });
}

util.inherits(WritableStream, stream.Writable);

WritableStream.prototype._write = (data, encoding, cb) => {
  if (this.forceError) this.emit("error", new Error("Fake error"));
  cb(this.forceError || null);
};

WritableStream.prototype.close = (cb) => {
  this.emit("close");
  if (cb) cb();
};

WritableStream.prototype.forceErrorOnWrite = () => {
  this.forceError = true;
  return this;
};

module.exports = WritableStream;
