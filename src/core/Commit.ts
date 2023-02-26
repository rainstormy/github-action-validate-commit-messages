export type Commit = {
	readonly sha: string
	readonly naturalSubjectLine: string
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

	const isFixup = subjectLine.startsWith("fixup!")
	const isSquash = subjectLine.startsWith("squash!")

	function getNaturalSubjectLine(): string {
		if (isFixup) {
			return subjectLine.slice("fixup!".length).trim()
		}

		if (isSquash) {
			return subjectLine.slice("squash!".length).trim()
		}

		return subjectLine
	}

	return {
		sha,
		naturalSubjectLine: getNaturalSubjectLine(),
		isFixup,
		isSquash,
		isMerge: parents.length > 1,
		toString: () => subjectLine,
	}
}
