import type { Commit, CommitRefiner } from "+commits"

export function compoundCommitRefiner(
	refiners: ReadonlyArray<CommitRefiner>,
): CommitRefiner {
	function refineCommit(commit: Commit): Commit {
		// eslint-disable-next-line unicorn/no-array-reduce -- It corresponds to a functional composition of refiners, the first refiner being the innermost function.
		const refinedCommit = refiners.reduce(
			(refinedCommitSoFar, refiner) => refiner.refineCommit(refinedCommitSoFar),
			commit,
		)

		return refinedCommit === commit ? commit : refineCommit(refinedCommit)
	}

	return { refineCommit }
}
