const nativePromise = global.Promise;

export function removeNativePromise() {
  if (global.Promise) {
    // @ts-ignore Testing Promise removal
    global.Promise = undefined;
  }
}

export function restoreNativePromise() {
  if (!global.Promise) {
    // @ts-ignore Restoring native Promise
    global.Promise = nativePromise;
  }
}
