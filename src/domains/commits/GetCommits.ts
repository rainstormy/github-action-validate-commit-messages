import type { Commits } from "#commits/Commit"

export async function getCommits(): Promise<Commits> {
	switch (import.meta.env.VITE_TARGET_PLATFORM) {
		case "cli": {
			return ["cli"]
		}
		case "gha": {
			return ["gha"]
		}
	}
}
