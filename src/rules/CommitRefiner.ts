import { type Commit } from "+rules/Commit"
import { type Rule } from "+rules/Rule"

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
		// eslint-disable-next-line unicorn/no-array-reduce -- It corresponds to a functional composition of refiners, the first refiner being the innermost function.
		const refinedCommit = refiners.reduce(
			(refinedCommitSoFar, refiner) => refiner(refinedCommitSoFar),
			commit,
		)

		return refinedCommit === commit ? commit : refineCommit(refinedCommit)
	}

	return refineCommit
}
