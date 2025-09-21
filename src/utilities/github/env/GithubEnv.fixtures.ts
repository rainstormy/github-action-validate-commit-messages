import { vi } from "vitest"
import type { GithubEnv } from "#utilities/github/env/GithubEnv.ts"

export function injectGithubEnv(overrides: Partial<GithubEnv> = {}): void {
	const { eventPath = "/github/workflow/event.json" } = overrides

	vi.stubEnv("GITHUB_EVENT_PATH", eventPath)
}
