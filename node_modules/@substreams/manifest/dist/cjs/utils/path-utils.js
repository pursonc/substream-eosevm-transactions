"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isManifestFile = isManifestFile;
exports.isPackageFile = isPackageFile;
exports.isReadableLocalFile = isReadableLocalFile;
exports.isRemotePath = isRemotePath;
exports.resolveLocalFile = resolveLocalFile;
var fs = /*#__PURE__*/_interopRequireWildcard( /*#__PURE__*/require("node:fs"));
var path = /*#__PURE__*/_interopRequireWildcard( /*#__PURE__*/require("node:path"));
function _getRequireWildcardCache(e) {
  if ("function" != typeof WeakMap) return null;
  var r = new WeakMap(),
    t = new WeakMap();
  return (_getRequireWildcardCache = function (e) {
    return e ? t : r;
  })(e);
}
function _interopRequireWildcard(e, r) {
  if (!r && e && e.__esModule) return e;
  if (null === e || "object" != typeof e && "function" != typeof e) return {
    default: e
  };
  var t = _getRequireWildcardCache(r);
  if (t && t.has(e)) return t.get(e);
  var n = {
      __proto__: null
    },
    a = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
    var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
    i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
  }
  return n.default = e, t && t.set(e, n), n;
}
function isManifestFile(file) {
  if (isRemotePath(file)) {
    return false;
  }
  return file.endsWith(".yaml") || file.endsWith(".yml");
}
function isPackageFile(path) {
  return path.endsWith(".spkg");
}
function isRemotePath(path) {
  return path.startsWith("http://") || path.startsWith("https://");
}
function isReadableLocalFile(filePath) {
  if (isRemotePath(filePath)) {
    return false;
  }
  try {
    if (path.isAbsolute(filePath)) {
      fs.accessSync(filePath, fs.constants.R_OK);
      return true;
    }
  } catch {}
  return false;
}
function resolveLocalFile(file, cwd = process.cwd()) {
  if (isRemotePath(file)) {
    throw new Error(`Expected a local file path, but received ${file}`);
  }
  if (path.isAbsolute(file)) {
    return file;
  }
  return path.resolve(cwd, file);
}
//# sourceMappingURL=path-utils.js.map