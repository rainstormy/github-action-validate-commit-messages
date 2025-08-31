import { vi } from "vitest"
import type { CometVersion } from "#utilities/version/CometVersion"

export function injectCometVersion(version: CometVersion): void {
	vi.stubEnv("COMET_VERSION", version)
}
