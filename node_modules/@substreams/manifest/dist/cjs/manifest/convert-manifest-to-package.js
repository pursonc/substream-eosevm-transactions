"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertManifestToPackage = convertManifestToPackage;
var path = /*#__PURE__*/_interopRequireWildcard( /*#__PURE__*/require("node:path"));
var _core = /*#__PURE__*/require("@substreams/core");
var _proto = /*#__PURE__*/require("@substreams/core/proto");
var _readLocalProtos = /*#__PURE__*/require("../protobuf/read-local-protos.js");
var _readSystemProtos = /*#__PURE__*/require("../protobuf/read-system-protos.js");
var _readPackage = /*#__PURE__*/require("../reader/read-package.js");
var _pathUtils = /*#__PURE__*/require("../utils/path-utils.js");
var _createPackageFromManifest = /*#__PURE__*/require("./create-package-from-manifest.js");
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
async function convertManifestToPackage(manifest, cwd) {
  const pkg = (0, _createPackageFromManifest.createPackageFromManifest)(manifest, cwd);
  pkg.protoFiles.push(...(await readImportedProtos(manifest, cwd)));
  // TODO: Should we prevent recursive dependencies? What about duplicates? Should we merge & deduplicate those?
  for (const [key, value] of Object.entries(manifest.imports ?? {})) {
    const imported = await readImportedPackage(key, resolveImportedPackagePath(value, cwd));
    imported.modules = imported.modules ?? new _proto.Modules();
    pkg.modules = pkg.modules ?? new _proto.Modules();
    for (const meta of imported.moduleMeta) {
      meta.packageIndex += BigInt(pkg.packageMeta.length);
    }
    for (const mod of imported.modules?.modules ?? []) {
      mod.binaryIndex += pkg.modules.binaries.length;
    }
    pkg.modules.modules.push(...imported.modules.modules);
    pkg.modules.binaries.push(...imported.modules.binaries);
    pkg.moduleMeta.push(...imported.moduleMeta);
    pkg.packageMeta.push(...imported.packageMeta);
    // Deduplicate proto files. First wins.
    for (const file of imported.protoFiles) {
      // TODO: Verify that this is the same approach used by the go package.
      if (file.name !== undefined && pkg.protoFiles.findIndex(inner => inner.name === file.name) !== -1) {
        continue;
      }
      pkg.protoFiles.push(file);
    }
  }
  const modules = pkg.modules?.modules ?? [];
  const graph = (0, _core.createModuleGraph)(modules);
  for (const module of modules) {
    module.initialBlock = graph.startBlockFor(module);
  }
  return pkg;
}
function resolveImportedPackagePath(path, context) {
  if ((0, _pathUtils.isRemotePath)(path)) {
    return path;
  }
  return (0, _pathUtils.resolveLocalFile)(path, context);
}
async function readImportedPackage(key, path) {
  const imported = await (0, _readPackage.readPackage)(path);
  if (imported.modules !== undefined) {
    prefixImportedModules(imported.modules.modules, key);
  }
  return imported;
}
function prefixImportedModules(modules, prefix) {
  for (const module of modules) {
    module.name = `${prefix}:${module.name}`;
    for (const [index, input] of module.inputs.entries()) {
      switch (input.input.case) {
        case "store":
          {
            input.input.value.moduleName = `${prefix}:${input.input.value.moduleName}`;
            break;
          }
        case "map":
          {
            input.input.value.moduleName = `${prefix}:${input.input.value.moduleName}`;
            break;
          }
        case "source":
        case "params":
          {
            break;
          }
        default:
          {
            throw new Error(`Module ${module.name} input index ${index}: unsupported module input type ${input.input.case}`);
          }
      }
    }
  }
}
async function readImportedProtos(manifest, cwd) {
  const output = [];
  const system = (0, _readSystemProtos.readSystemProtos)();
  for (const file of system.file) {
    // Ensure that the manifest doesn't include system protobufs.
    if (manifest.protobuf.files.find(inner => inner === file.name)) {
      throw new Error(`Proto file ${file} already exists in system protobufs, do not include it in your manifest`);
    }
    output.push(file);
  }
  const paths = new Set();
  for (const imp of manifest.protobuf.importPaths) {
    paths.add(path.resolve(cwd, imp));
  }
  // The manifest's root directory is always added to the list of import paths so that
  // files specified relative to the manifest's directory work properly. It is added last
  // so that if the user-specified import paths contain the file, it's picked from their
  // import paths instead of the implicitly added folder.
  paths.add(cwd);
  for (const file of manifest.protobuf.files) {
    // Find the first readable file in the import paths.
    let context = undefined;
    for (const candidate of paths) {
      const resolved = path.resolve(candidate, file);
      if ((0, _pathUtils.isReadableLocalFile)(resolved)) {
        context = candidate;
        break;
      }
    }
    if (context === undefined) {
      throw new Error(`Proto file ${file} does not exist or is not readable`);
    }
    const descriptor = await (0, _readLocalProtos.readLocalProtos)(context, file);
    output.push(...descriptor.file);
  }
  return output;
}
//# sourceMappingURL=convert-manifest-to-package.js.map