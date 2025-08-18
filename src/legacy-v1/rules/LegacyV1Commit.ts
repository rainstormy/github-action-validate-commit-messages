export type LegacyV1RawCommit = {
	readonly sha: string
	readonly author: LegacyV1UserIdentity
	readonly committer: LegacyV1UserIdentity
	readonly parents: ReadonlyArray<LegacyV1ParentCommit>
	readonly commitMessage: string
}

export type LegacyV1RawCommits = Array<LegacyV1RawCommit>

export type LegacyV1Commit = {
	readonly sha: string
	readonly author: LegacyV1UserIdentity
	readonly committer: LegacyV1UserIdentity
	readonly parents: ReadonlyArray<LegacyV1ParentCommit>
	readonly originalSubjectLine: string
	readonly squashPrefixes: ReadonlyArray<string>
	readonly issueReferences: ReadonlyArray<string>
	readonly refinedSubjectLine: string
	readonly bodyLines: ReadonlyArray<string>
	readonly coAuthors: ReadonlyArray<string>
}

export type LegacyV1Commits = ReadonlyArray<LegacyV1Commit>

export type LegacyV1ParentCommit = {
	readonly sha: string
}

export type LegacyV1UserIdentity = {
	readonly name: string | null
	readonly emailAddress: string | null
}

export function legacyV1ParseCommit(
	rawCommit: LegacyV1RawCommit,
): LegacyV1Commit {
	const { sha, author, committer, parents, commitMessage } = rawCommit
	const [originalSubjectLine = "", ...bodyLines] = commitMessage.split("\n")

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
