import type { CommitSha } from "#types/CommitSha.ts"

export type Commit = {
	sha: CommitSha
	parents: Array<CommitSha>
	author: CommitUser
	committer: CommitUser
	subjectLine: string
	bodyLines: Array<string>
}

export type Commits = Array<Commit>

export type CommitUser = {
	name: string | null
	emailAddress: string | null
}
