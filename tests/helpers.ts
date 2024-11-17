const nativePromise = global.Promise;

export const removeNativePromise = () => {
  if (global.Promise) {
    global.Promise = undefined;
  }
}
export const restoreNativePromise = () => {
  if (!global.Promise) {
    global.Promise = nativePromise;
  }
}
