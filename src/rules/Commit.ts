export type RawCommit = {
	readonly sha: string
	readonly author: UserIdentity
	readonly committer: UserIdentity
	readonly parents: ReadonlyArray<ParentCommit>
	readonly commitMessage: string
}

export type Commit = {
	readonly sha: string
	readonly author: UserIdentity
	readonly committer: UserIdentity
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

export type UserIdentity = {
	readonly name: string | null
	readonly emailAddress: string | null
}

export function parseCommit(rawCommit: RawCommit): Commit {
	const { sha, author, committer, parents, commitMessage } = rawCommit
	const [originalSubjectLine, ...bodyLines] = commitMessage.split("\n")

	return {
		sha,
		author,
		committer,
		parents,
		originalSubjectLine,
		squashPrefixes: [],
		issueReferences: [],
		refinedSubjectLine: originalSubjectLine.trim(),
		bodyLines,
		coAuthors: [],
	}
}
