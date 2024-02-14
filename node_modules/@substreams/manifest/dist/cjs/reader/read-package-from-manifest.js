"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPackageFromManifest = readPackageFromManifest;
var fs = /*#__PURE__*/_interopRequireWildcard( /*#__PURE__*/require("node:fs"));
var path = /*#__PURE__*/_interopRequireWildcard( /*#__PURE__*/require("node:path"));
var _yaml = /*#__PURE__*/require("yaml");
var _convertManifestToPackage = /*#__PURE__*/require("../manifest/convert-manifest-to-package.js");
var _manifestSchema = /*#__PURE__*/require("../manifest/manifest-schema.js");
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
function readPackageFromManifest(file) {
  const json = (0, _yaml.parse)(fs.readFileSync(file, "utf-8"));
  if (typeof json !== "object" || json === null) {
    throw new Error(`Failed to load manifest ${file}`);
  }
  const manifest = (0, _manifestSchema.parseManifestJson)(json);
  return (0, _convertManifestToPackage.convertManifestToPackage)(manifest, path.dirname(file));
}
//# sourceMappingURL=read-package-from-manifest.js.map