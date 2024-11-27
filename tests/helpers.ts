const nativePromise = global.Promise;

export function removeNativePromise() {
  if (global.Promise) {
    global.Promise = undefined;
  }
}

export function restoreNativePromise() {
  if (!global.Promise) {
    global.Promise = nativePromise;
  }
}
