import type { Commits } from "#commits/Commit.ts"
import { getGithubPullRequestCommits } from "#commits/github/GetGithubPullRequestCommits.ts"
import type { CometPlatform } from "#utilities/platform/CometPlatform.ts"

export async function getCommits(): Promise<Commits> {
	const platform: CometPlatform = import.meta.env.COMET_PLATFORM

	switch (platform) {
		case "cli": {
			return []
		}
		case "gha": {
			return getGithubPullRequestCommits()
		}
	}
}
