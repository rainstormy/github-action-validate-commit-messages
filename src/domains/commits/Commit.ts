import type { BodyLines } from "#commits/BodyLine.ts"
import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import type { SubjectLine } from "#commits/SubjectLine.ts"
import type { Configuration } from "#configurations/Configuration.ts"
import type { CommitSha } from "#types/CommitSha.ts"
import { notEmptyString } from "#utilities/Arrays.ts"

/**
 * A platform-agnostic representation of a commit with refined data.
 */
export type Commit = {
	sha: CommitSha
	authorName: string | null
	authorEmail: string | null
	committerName: string | null
	committerEmail: string | null
	isMergeCommit: boolean
	subjectLine: SubjectLine
	bodyLines: BodyLines
}

export type Commits = Array<Commit>

export function mapCrudeCommitToCommit(
	crudeCommit: CrudeCommit,
	_configuration: Configuration,
): Commit {
	const [subjectLine = "", ...bodyLines] = crudeCommit.message.split("\n")

	return {
		sha: crudeCommit.sha,
		isMergeCommit: crudeCommit.parents.length > 1,
		authorName: crudeCommit.authorName,
		authorEmail: crudeCommit.authorEmail,
		committerName: crudeCommit.committerName,
		committerEmail: crudeCommit.committerEmail,
		subjectLine: [subjectLine].filter(notEmptyString),
		bodyLines: bodyLines.map((bodyLine) => [bodyLine].filter(notEmptyString)),
	}
}
