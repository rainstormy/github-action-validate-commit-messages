export type LegacyV1RawCommit = {
	sha: string
	author: LegacyV1UserIdentity
	committer: LegacyV1UserIdentity
	parents: Array<LegacyV1ParentCommit>
	commitMessage: string
}

export type LegacyV1RawCommits = Array<LegacyV1RawCommit>

export type LegacyV1Commit = {
	sha: string
	author: LegacyV1UserIdentity
	committer: LegacyV1UserIdentity
	parents: Array<LegacyV1ParentCommit>
	originalSubjectLine: string
	squashPrefixes: Array<string>
	issueReferences: Array<string>
	refinedSubjectLine: string
	bodyLines: Array<string>
	coAuthors: Array<string>
}

export type LegacyV1Commits = Array<LegacyV1Commit>

export type LegacyV1ParentCommit = {
	sha: string
}

export type LegacyV1UserIdentity = {
	name: string | null
	emailAddress: string | null
}

export function legacyV1ParseCommit(rawCommit: LegacyV1RawCommit): LegacyV1Commit {
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
