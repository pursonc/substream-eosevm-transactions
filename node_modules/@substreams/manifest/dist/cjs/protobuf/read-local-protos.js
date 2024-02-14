"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readLocalProtos = readLocalProtos;
var _nodeChild_process = /*#__PURE__*/require("node:child_process");
var _protobuf = /*#__PURE__*/require("@bufbuild/protobuf");
var _locateBufBinary = /*#__PURE__*/require("./locate-buf-binary.js");
async function readLocalProtos(context, file) {
  const buf = await (0, _locateBufBinary.locateBufBinary)();
  if (buf === undefined) {
    throw new Error("Buf is not installed");
  }
  const data = await new Promise((resolve, reject) => {
    const chunks = [];
    const spawned = (0, _nodeChild_process.spawn)(buf, ["build", "--as-file-descriptor-set", "--path", file, "--output", "/dev/stdout"], {
      cwd: context
    });
    spawned.stdout.on("data", data => {
      chunks.push(data);
    });
    spawned.on("close", code => {
      if (code !== 0) {
        return reject(new Error(`Failed to read protobuf file ${file} in ${context}`));
      }
      resolve(Buffer.concat(chunks));
    });
  });
  return _protobuf.FileDescriptorSet.fromBinary(data);
}
//# sourceMappingURL=read-local-protos.js.map