import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import type { CoauthorToken } from "#commits/tokens/CoauthorToken.ts"
import type { DependencyVersionToken } from "#commits/tokens/DependencyVersionToken.ts"
import type { FencedCodeBlockToken } from "#commits/tokens/FencedCodeBlockToken.ts"
import type { HyperlinkToken } from "#commits/tokens/HyperlinkToken.ts"
import {
	type IssueLinkToken,
	tokeniseIssueLinks,
} from "#commits/tokens/IssueLinkToken.ts"
import {
	type SquashMarkerToken,
	tokeniseSquashMarkers,
} from "#commits/tokens/SquashMarkerToken.ts"
import type {
	Configuration,
	TokenConfiguration,
} from "#configurations/Configuration.ts"
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
	| IssueLinkToken
	| SquashMarkerToken

export type TokenisedLine = Array<Token>
export type TokenisedLines = Array<TokenisedLine>

export type Tokeniser = (
	initialTokens: TokenisedLine,
	configuration: TokenConfiguration,
) => TokenisedLine

export type Tokenisers = Array<Tokeniser>

export function mapCrudeCommitToCommit(
	crudeCommit: CrudeCommit,
	configuration: Configuration,
): Commit {
	const [crudeSubjectLine = "", ...crudeBodyLines] =
		crudeCommit.message.split("\n")

	return {
		sha: crudeCommit.sha,
		isMergeCommit: crudeCommit.parents.length > 1,
		authorName: crudeCommit.authorName,
		authorEmail: crudeCommit.authorEmail,
		committerName: crudeCommit.committerName,
		committerEmail: crudeCommit.committerEmail,
		subjectLine: tokeniseSubjectLine(crudeSubjectLine, configuration.tokens),
		bodyLines: crudeBodyLines.map((crudeBodyLine) =>
			[crudeBodyLine].filter(notEmptyString),
		),
	}
}

// Ordered from the highest priority to the lowest priority.
const tokenisers: Tokenisers = [tokeniseSquashMarkers, tokeniseIssueLinks]

function tokeniseSubjectLine(
	crudeSubjectLine: string,
	tokenConfiguration: TokenConfiguration,
): TokenisedLine {
	return tokenisers
		.reduce<TokenisedLine>(
			(tokenisedSubjectLineSoFar, tokenise) =>
				tokenise(tokenisedSubjectLineSoFar, tokenConfiguration),
			[crudeSubjectLine],
		)
		.filter(notEmptyString)
}
