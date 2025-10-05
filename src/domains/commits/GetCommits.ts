import type { Commits } from "#commits/Commit"
import { getGithubPullRequestCommits } from "#commits/github/GetGithubPullRequestCommits"
import { getGithubPullRequestNumber } from "#utilities/github/event/GetGithubPullRequestNumber"
import type { CometPlatform } from "#utilities/platform/CometPlatform"

export async function getCommits(): Promise<Commits> {
	const platform: CometPlatform = import.meta.env.COMET_PLATFORM

	switch (platform) {
		case "cli": {
			return []
		}
		case "gha": {
			const pullRequestNumber = await getGithubPullRequestNumber()

			if (pullRequestNumber === null) {
				throw new Error("This action must run on a pull request")
			}

			return getGithubPullRequestCommits(pullRequestNumber)
		}
	}
}
