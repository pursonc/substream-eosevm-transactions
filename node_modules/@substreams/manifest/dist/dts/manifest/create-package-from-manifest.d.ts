import { Package } from "@substreams/core/proto";
import type { Manifest } from "./manifest-schema.js";
export type ConvertToPackageOptions = {
    skipSourceCodeImportValidation?: boolean;
};
export declare function createPackageFromManifest(manifest: Manifest, cwd: string, { skipSourceCodeImportValidation }?: ConvertToPackageOptions): Package;
//# sourceMappingURL=create-package-from-manifest.d.ts.map