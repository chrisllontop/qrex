/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
function isValid(version?: number): boolean {
  return !Number.isNaN(version) && version! >= 1 && version! <= 40;
}

export const VersionCheck = {
  isValid,
};
