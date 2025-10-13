import { vi } from "vitest"
import type { CometPlatform } from "#utilities/platform/CometPlatform.ts"

export function injectCometPlatform(platform: CometPlatform): void {
	vi.stubEnv("COMET_PLATFORM", platform)
}
