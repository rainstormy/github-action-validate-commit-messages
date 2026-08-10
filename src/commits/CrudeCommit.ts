import type { CommitSha } from "#types/CommitSha.ts"

/**
 * A platform-agnostic representation of a commit with unprocessed data.
 */
export type CrudeCommit = {
	sha: CommitSha
	parents: Array<CommitSha>
	authorName: string
	authorEmail: string
	committerName: string
	committerEmail: string
	message: string
	signature: string
}

export type CrudeCommits = Array<CrudeCommit>
