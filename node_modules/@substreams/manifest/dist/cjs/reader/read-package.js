"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPackage = readPackage;
var _core = /*#__PURE__*/require("@substreams/core");
var _pathUtils = /*#__PURE__*/require("../utils/path-utils.js");
var _readPackageFromFile = /*#__PURE__*/require("./read-package-from-file.js");
var _readPackageFromManifest = /*#__PURE__*/require("./read-package-from-manifest.js");
async function readPackage(file) {
  if ((0, _pathUtils.isRemotePath)(file)) {
    if ((0, _pathUtils.isManifestFile)(file)) {
      throw new Error("Remote manifest files are not supported");
    }
    return (0, _core.fetchSubstream)(file);
  }
  if (!(0, _pathUtils.isReadableLocalFile)(file)) {
    throw new Error("File is not readable");
  }
  return (0, _pathUtils.isPackageFile)(file) ? (0, _readPackageFromFile.readPackageFromFile)(file) : (0, _readPackageFromManifest.readPackageFromManifest)(file);
}
//# sourceMappingURL=read-package.js.map