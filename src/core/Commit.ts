export type Commit = {
	readonly sha: string
	readonly subjectLine: string
	readonly isFixup: boolean
	readonly isMerge: boolean
	readonly isSquash: boolean
	readonly toString: () => string
}

type CommitProps = {
	readonly sha: string
	readonly commitMessage: string
	readonly parents: ReadonlyArray<ParentCommit>
}

type ParentCommit = {
	readonly sha: string
}

export function commitOf({ sha, commitMessage, parents }: CommitProps): Commit {
	const lines = commitMessage.split("\n")
	const subjectLine = lines[0]

	return {
		sha,
		subjectLine,
		isFixup: subjectLine.startsWith("fixup!"),
		isMerge: parents.length > 1,
		isSquash: subjectLine.startsWith("squash!"),
		toString: () => subjectLine,
	}
}
