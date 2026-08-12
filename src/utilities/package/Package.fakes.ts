import { vi } from "vitest"
// oxlint-disable-next-line no-restricted-imports -- Match the `package.json` import in `Package.ts`.
import * as packagejson from "../../../package.json"

export function mockPackageVersion(version: string): void {
	vi.spyOn(packagejson, "version", "get").mockReturnValue(version)
}
