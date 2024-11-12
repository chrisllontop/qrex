const nativePromise = global.Promise;

exports.removeNativePromise = () => {
  if (global.Promise) {
    delete global.Promise;
  }
};

exports.restoreNativePromise = () => {
  if (!global.Promise) {
    global.Promise = nativePromise;
  }
};
