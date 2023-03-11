import type { CommitRefiner } from "+commits"

export type RawCommit = {
	readonly sha: string
	readonly parents: ReadonlyArray<ParentCommit>
	readonly commitMessage: string
}

export type Commit = {
	readonly sha: string
	readonly parents: ReadonlyArray<ParentCommit>
	readonly originalSubjectLine: string
	readonly squashPrefixes: ReadonlyArray<string>
	readonly refinedSubjectLine: string
}

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
		squashPrefixes: [],
		refinedSubjectLine: originalSubjectLine,
	}

	return refiner.refineCommit(baseCommit)
}
