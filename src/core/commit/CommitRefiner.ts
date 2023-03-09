import type { Commit, CommitModifier } from "+core"

export type CommitRefiner = {
	readonly refineCommit: (commit: Commit) => Commit
}

export function commitRefinerFrom(): CommitRefiner {
	return compoundCommitRefiner([
		modifierExtractingCommitRefiner("amend!"),
		modifierExtractingCommitRefiner("fixup!"),
		modifierExtractingCommitRefiner("squash!"),
	])
}

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

export function modifierExtractingCommitRefiner(
	modifier: CommitModifier,
): CommitRefiner {
	return {
		refineCommit: (commit) => {
			const { modifiers, refinedSubjectLine: currentSubjectLine } = commit

			if (!currentSubjectLine.startsWith(modifier)) {
				return commit
			}

			const refinedSubjectLine = currentSubjectLine.slice(modifier.length)

			return {
				...commit,
				modifiers: [...modifiers, modifier],
				refinedSubjectLine: refinedSubjectLine.trim(),
			}
		},
	}
}
