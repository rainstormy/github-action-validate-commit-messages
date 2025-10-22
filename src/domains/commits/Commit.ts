import type { CommitSha } from "#types/CommitSha.ts"

export type Commit = {
	sha: CommitSha
	parents: Array<CommitSha>
	authorName: string | null
	authorEmail: string | null
	committerName: string | null
	committerEmail: string | null
	subjectLine: string
	bodyLines: Array<string>
}

export type Commits = Array<Commit>
