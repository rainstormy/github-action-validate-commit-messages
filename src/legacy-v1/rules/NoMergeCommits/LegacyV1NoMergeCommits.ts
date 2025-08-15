import type { LegacyV1Commit } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1NoMergeCommits(): LegacyV1Rule {
	return {
		key: "no-merge-commits",
		getInvalidCommits: (refinedCommits): ReadonlyArray<LegacyV1Commit> =>
			refinedCommits.filter(({ parents }) => parents.length > 1),
	}
}
