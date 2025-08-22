import { beforeAll, vi } from "vitest"
import type { TargetPlatform } from "#utilities/targetplatform/TargetPlatform"

export function injectTargetPlatform(platform: TargetPlatform): void {
	beforeAll(() => {
		vi.stubEnv("VITE_TARGET_PLATFORM", platform)
	})
}
