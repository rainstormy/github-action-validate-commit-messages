import type { CommitRefiner } from "+core"

export type RawCommit = {
	readonly sha: string
	readonly parents: ReadonlyArray<ParentCommit>
	readonly commitMessage: string
}

export type Commit = {
	readonly sha: string
	readonly parents: ReadonlyArray<ParentCommit>
	readonly originalSubjectLine: string
	readonly modifiers: ReadonlyArray<CommitModifier>
	readonly refinedSubjectLine: string
}

export type CommitModifier = "amend!" | "fixup!" | "squash!"

export type ParentCommit = {
	readonly sha: string
}

export function parseCommit(
	rawCommit: RawCommit,
	refiner: CommitRefiner,
): Commit {
	const { sha, parents, commitMessage } = rawCommit
	const [originalSubjectLine] = commitMessage.split("\n")

	const baseCommit: Commit = {
		sha,
		parents,
		originalSubjectLine,
		modifiers: [],
		refinedSubjectLine: originalSubjectLine,
	}

	return refiner.refineCommit(baseCommit)
}
