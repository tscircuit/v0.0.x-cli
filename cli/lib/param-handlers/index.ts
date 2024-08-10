import { interactForLocalDirectory } from "./interact-for-local-directory"
import { interactForLocalFile } from "./interact-for-local-file"
import { interactForPackageExampleId } from "./interact-for-package-example-id"
import { interactForPackageName } from "./interact-for-package-name"
import { interactForPackageNameWithVersion } from "./interact-for-package-name-with-version"
import { interactForPackageReleaseId } from "./interact-for-package-release-id"
import { interactForRegistryUrl } from "./interact-for-registry-url"
import { interactForRuntime } from "./interact-for-runtime"
import { ParamHandler } from "./param-handler-type"

export const PARAM_HANDLERS_BY_PARAM_NAME: Record<string, ParamHandler> = {
  file: interactForLocalFile,
  cwd: interactForLocalDirectory,
  dir: interactForLocalDirectory,
  registry_url: interactForRegistryUrl,
  runtime: interactForRuntime,
  package_release_id: interactForPackageReleaseId,
  package_name: interactForPackageName,
  package_name_with_version: interactForPackageNameWithVersion,
  package_example_id: interactForPackageExampleId,
}
