import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import type { Tokens } from "#commits/tokens/Token.ts"
import {
	type TokeniserPatterns,
	issueLinkPattern,
	tokeniseBodyLines,
	tokeniseSubjectLine,
} from "#commits/tokens/Tokenise.ts"
import type { TokenConfiguration } from "#configurations/Configuration.ts"
import type { CommitSha } from "#types/CommitSha.ts"

/**
 * A platform-agnostic representation of a commit with refined data.
 */
export type Commit = {
	sha: CommitSha
	authorName: string
	authorEmail: string
	committerName: string
	committerEmail: string
	isMergeCommit: boolean
	hasSignature: boolean
	subjectLine: Tokens
	bodyLines: Array<Tokens>
}

export type Commits = Array<Commit>

export function mapCrudeCommitToCommit(
	crudeCommit: CrudeCommit,
	configuration: TokenConfiguration,
): Commit {
	const [crudeSubjectLine = "", ...crudeBodyLines] = crudeCommit.message.split("\n")

	const patterns: TokeniserPatterns = {
		issueLink: issueLinkPattern(configuration),
	}

	return {
		sha: crudeCommit.sha,
		isMergeCommit: crudeCommit.parents.length > 1,
		hasSignature: crudeCommit.signature !== "",
		authorName: crudeCommit.authorName,
		authorEmail: crudeCommit.authorEmail,
		committerName: crudeCommit.committerName,
		committerEmail: crudeCommit.committerEmail,
		subjectLine: tokeniseSubjectLine(crudeSubjectLine, patterns),
		bodyLines: tokeniseBodyLines(crudeBodyLines, patterns),
	}
}
