import type { LegacyV1Commit } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export type LegacyV1CommitRefiner = (commit: LegacyV1Commit) => LegacyV1Commit

export function legacyV1CommitRefinerFrom(
	rules: ReadonlyArray<LegacyV1Rule>,
): LegacyV1CommitRefiner {
	const refiners = rules
		.map((rule) => rule.refine)
		.filter(
			(refiner): refiner is LegacyV1CommitRefiner => refiner !== undefined,
		)

	return compoundCommitRefinerFrom(refiners)
}

function compoundCommitRefinerFrom(
	refiners: ReadonlyArray<LegacyV1CommitRefiner>,
): LegacyV1CommitRefiner {
	function refineCommit(commit: LegacyV1Commit): LegacyV1Commit {
		const refinedCommit = refiners.reduce(
			(refinedCommitSoFar, refiner) => refiner(refinedCommitSoFar),
			commit,
		)

		return refinedCommit === commit ? commit : refineCommit(refinedCommit)
	}

	return refineCommit
}
