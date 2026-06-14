import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import { tokeniseDependencyVersions } from "#commits/tokens/DependencyVersionToken.ts"
import { tokeniseFencedCodeBlocks } from "#commits/tokens/FencedCodeBlockToken.ts"
import { tokeniseInlineCodePhrases } from "#commits/tokens/InlineCodeToken.ts"
import { tokeniseIssueLinks } from "#commits/tokens/IssueLinkToken.ts"
import { tokeniseRevertMarkers } from "#commits/tokens/RevertMarkerToken.ts"
import { tokeniseSquashMarkers } from "#commits/tokens/SquashMarkerToken.ts"
import { rawText } from "#commits/tokens/TextToken.ts"
import type { Token, TokenisedLine, TokenisedLines } from "#commits/tokens/Token.ts"
import { tokeniseTrailers } from "#commits/tokens/TrailerToken.ts"
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
	subjectLine: TokenisedLine
	bodyLines: TokenisedLines
}

export type Commits = Array<Commit>

export function mapCrudeCommitToCommit(
	crudeCommit: CrudeCommit,
	configuration: TokenConfiguration,
): Commit {
	const [crudeSubjectLine = "", ...crudeBodyLines] = crudeCommit.message.split("\n")

	return {
		sha: crudeCommit.sha,
		isMergeCommit: crudeCommit.parents.length > 1,
		hasSignature: crudeCommit.signature !== "",
		authorName: crudeCommit.authorName,
		authorEmail: crudeCommit.authorEmail,
		committerName: crudeCommit.committerName,
		committerEmail: crudeCommit.committerEmail,
		subjectLine: tokeniseSubjectLine(crudeSubjectLine, configuration),
		bodyLines: tokeniseBodyLines(crudeBodyLines, configuration),
	}
}

function tokeniseSubjectLine(
	crudeSubjectLine: string,
	configuration: TokenConfiguration,
): TokenisedLine {
	const initialTokens = [rawText(crudeSubjectLine)]

	return tokeniseDependencyVersions(
		tokeniseIssueLinks(
			tokeniseInlineCodePhrases(tokeniseRevertMarkers(tokeniseSquashMarkers(initialTokens))),
			configuration,
		),
	).filter(notEmptyToken)
}

function tokeniseBodyLines(
	crudeBodyLines: Array<string>,
	configuration: TokenConfiguration,
): TokenisedLines {
	return tokeniseTrailers(
		tokeniseFencedCodeBlocks(
			crudeBodyLines.map((crudeBodyLine) => tokeniseBodyLine(crudeBodyLine, configuration)),
		),
	)
}

function tokeniseBodyLine(
	crudeBodyLine: string,
	_configuration: TokenConfiguration,
): TokenisedLine {
	const initialTokens = [rawText(crudeBodyLine)]

	return initialTokens.filter(notEmptyToken)
}

function notEmptyToken(token: Token): boolean {
	return token.value !== ""
}
