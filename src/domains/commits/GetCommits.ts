import type { Commits } from "#commits/Commit"
import type { CometPlatform } from "#utilities/platform/CometPlatform"

export async function getCommits(): Promise<Commits> {
	const platform: CometPlatform = import.meta.env.COMET_PLATFORM

	switch (platform) {
		case "cli": {
			return ["cli"]
		}
		case "gha": {
			return ["gha"]
		}
	}
}
