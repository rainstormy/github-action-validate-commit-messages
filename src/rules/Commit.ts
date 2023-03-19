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
	readonly issueReferences: ReadonlyArray<string>
	readonly refinedSubjectLine: string
	readonly bodyLines: ReadonlyArray<string>
	readonly coAuthors: ReadonlyArray<string>
}

export type ParentCommit = {
	readonly sha: string
}

export function parseCommit(rawCommit: RawCommit): Commit {
	const { sha, parents, commitMessage } = rawCommit
	const [originalSubjectLine, ...bodyLines] = commitMessage.split("\n")

	return {
		sha,
		parents,
		originalSubjectLine,
		squashPrefixes: [],
		issueReferences: [],
		refinedSubjectLine: originalSubjectLine.trim(),
		bodyLines,
		coAuthors: [],
	}
}
