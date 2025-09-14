import { vi } from "vitest"
import type { CometPlatform } from "#utilities/platform/CometPlatform"

export function injectCometPlatform(platform: CometPlatform): void {
	vi.stubEnv("COMET_PLATFORM", platform)
}
