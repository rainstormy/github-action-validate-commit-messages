import { vi } from "vitest"
import type { GithubEnv } from "#utilities/github/env/GithubEnv"

export function injectGithubEnv(overrides: Partial<GithubEnv> = {}): void {
	const {
		apiBaseUrl = "https://api.github.com/repos/rainstormy/comet",
		eventPath = "/github/workflow/event.json",
		__secretToken__ = "ghp_NmRkYmFiYzItMWYzZi00Nzg3LThkYjQtMDhiZDA0OGY1MjQ3",
	} = overrides

	const [githubApiUrl, repository] = apiBaseUrl.split("/repos/")

	vi.stubEnv("GITHUB_API_URL", githubApiUrl)
	vi.stubEnv("GITHUB_EVENT_PATH", eventPath)
	vi.stubEnv("GITHUB_REPOSITORY", repository)
	vi.stubEnv("INPUT_GITHUB-TOKEN", __secretToken__)
}
