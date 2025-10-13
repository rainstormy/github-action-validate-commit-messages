import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit.ts"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule.ts"

export function legacyV1NoMergeCommits(): LegacyV1Rule {
	return {
		key: "no-merge-commits",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(({ parents }) => parents.length > 1),
	}
}
