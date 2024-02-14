"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeRequire = exports.locateBufBinary = void 0;
var _nodeChild_process = /*#__PURE__*/require("node:child_process");
var _nodeFs = /*#__PURE__*/require("node:fs");
var _nodeModule = /*#__PURE__*/require("node:module");
var _nodePath = /*#__PURE__*/require("node:path");
const nodeRequire = exports.nodeRequire = /*#__PURE__*/(0, _nodeModule.createRequire)(import.meta.url);
async function resolve(path) {
  return nodeRequire.resolve(path);
}
const locateBufBinary = exports.locateBufBinary = /*#__PURE__*/memoize(async function locateBufBinary() {
  try {
    // Check if buf is installed as a dependency.
    const buf = await resolve("@bufbuild/buf/package.json");
    const json = JSON.parse((0, _nodeFs.readFileSync)(buf, "utf-8"));
    return (0, _nodePath.resolve)((0, _nodePath.dirname)(buf), json.bin.buf);
  } catch {}
  try {
    // Check if buf is available on the path.
    (0, _nodeChild_process.execSync)("buf --version");
    return "buf";
  } catch {}
  return undefined;
});
function memoize(fn) {
  const unused = Symbol("UNUSED");
  let memoized = unused;
  return () => {
    if (memoized === unused) {
      memoized = fn();
    }
    return memoized;
  };
}
//# sourceMappingURL=locate-buf-binary.js.map