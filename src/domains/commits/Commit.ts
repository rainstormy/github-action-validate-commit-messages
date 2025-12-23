import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import type { CoauthorToken } from "#commits/tokens/CoauthorToken.ts"
import type { DependencyVersionToken } from "#commits/tokens/DependencyVersionToken.ts"
import type { FencedCodeBlockToken } from "#commits/tokens/FencedCodeBlockToken.ts"
import type { HyperlinkToken } from "#commits/tokens/HyperlinkToken.ts"
import type { IssueReferenceToken } from "#commits/tokens/IssueReferenceToken.ts"
import type { SquashMarkerToken } from "#commits/tokens/SquashMarkerToken.ts"
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
	subjectLine: TokenisedLine
	bodyLines: TokenisedLines
}

export type Commits = Array<Commit>

export type Token =
	| string
	| CoauthorToken
	| DependencyVersionToken
	| FencedCodeBlockToken
	| HyperlinkToken
	| IssueReferenceToken
	| SquashMarkerToken

export type TokenisedLine = Array<Token>
export type TokenisedLines = Array<TokenisedLine>

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
