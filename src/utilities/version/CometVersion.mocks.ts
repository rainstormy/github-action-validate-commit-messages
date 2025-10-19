import { vi } from "vitest"
import type { CometVersion } from "#utilities/version/CometVersion.ts"

export function injectCometVersion(version: CometVersion): void {
	vi.stubEnv("COMET_VERSION", version)
}
