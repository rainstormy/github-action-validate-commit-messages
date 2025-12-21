import { getGithubPullRequestCrudeCommits } from "#commits/github/GetGithubPullRequestCrudeCommits.ts"
import type { CommitSha } from "#types/CommitSha.ts"
import type { CometPlatform } from "#utilities/platform/CometPlatform.ts"

/**
 * A platform-agnostic representation of a commit with unprocessed data.
 */
export type CrudeCommit = {
	sha: CommitSha
	parents: Array<CommitSha>
	authorName: string | null
	authorEmail: string | null
	committerName: string | null
	committerEmail: string | null
	message: string
}

export type CrudeCommits = Array<CrudeCommit>

export async function getCrudeCommits(): Promise<CrudeCommits> {
	const platform: CometPlatform = import.meta.env.COMET_PLATFORM

	switch (platform) {
		case "cli": {
			return []
		}
		case "gha": {
			return getGithubPullRequestCrudeCommits()
		}
		default: {
			throw new Error("Environment variable 'COMET_PLATFORM' is undefined")
		}
	}
}
