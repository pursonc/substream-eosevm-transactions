import * as fs from "node:fs";
import { createSubstream } from "@substreams/core";
export function readPackageFromFile(file) {
  const fileContents = fs.readFileSync(file);
  return createSubstream(fileContents);
}
//# sourceMappingURL=read-package-from-file.js.map