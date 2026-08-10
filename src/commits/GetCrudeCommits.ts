import type { CrudeCommits } from "#commits/CrudeCommit.ts"
import { getGitBranchCrudeCommits } from "#commits/git/GetGitBranchCrudeCommits.ts"
import { getGithubPullRequestCrudeCommits } from "#commits/github/GetGithubPullRequestCrudeCommits.ts"
import type { CometPlatform } from "#utilities/platform/CometPlatform.ts"

export async function getCrudeCommits(): Promise<CrudeCommits> {
	const platform: CometPlatform = import.meta.env.COMET_PLATFORM

	switch (platform) {
		case "cli": {
			return getGitBranchCrudeCommits()
		}
		case "gha": {
			return getGithubPullRequestCrudeCommits()
		}
		default: {
			throw new Error("Environment variable 'COMET_PLATFORM' is undefined")
		}
	}
}
