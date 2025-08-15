import type { Commit } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

export type CommitRefiner = (commit: Commit) => Commit

export function commitRefinerFrom(rules: ReadonlyArray<Rule>): CommitRefiner {
	const refiners = rules
		.map((rule) => rule.refine)
		.filter((refiner): refiner is CommitRefiner => refiner !== undefined)

	return compoundCommitRefinerFrom(refiners)
}

function compoundCommitRefinerFrom(
	refiners: ReadonlyArray<CommitRefiner>,
): CommitRefiner {
	function refineCommit(commit: Commit): Commit {
		const refinedCommit = refiners.reduce(
			(refinedCommitSoFar, refiner) => refiner(refinedCommitSoFar),
			commit,
		)

		return refinedCommit === commit ? commit : refineCommit(refinedCommit)
	}

	return refineCommit
}
