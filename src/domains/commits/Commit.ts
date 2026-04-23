import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import { tokeniseDependencyVersions } from "#commits/tokens/DependencyVersionToken.ts"
import { tokeniseInlineCodePhrases } from "#commits/tokens/InlineCodeToken.ts"
import { tokeniseIssueLinks } from "#commits/tokens/IssueLinkToken.ts"
import { tokeniseRevertMarkers } from "#commits/tokens/RevertMarkerToken.ts"
import { tokeniseSquashMarkers } from "#commits/tokens/SquashMarkerToken.ts"
import { text } from "#commits/tokens/TextToken.ts"
import type { Token, TokenisedLine, TokenisedLines } from "#commits/tokens/Token.ts"
import type { Configuration, TokenConfiguration } from "#configurations/Configuration.ts"
import type { CommitSha } from "#types/CommitSha.ts"

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

export function mapCrudeCommitToCommit(
	crudeCommit: CrudeCommit,
	configuration: Configuration,
): Commit {
	const [crudeSubjectLine = "", ...crudeBodyLines] = crudeCommit.message.split("\n")

	return {
		sha: crudeCommit.sha,
		isMergeCommit: crudeCommit.parents.length > 1,
		authorName: crudeCommit.authorName,
		authorEmail: crudeCommit.authorEmail,
		committerName: crudeCommit.committerName,
		committerEmail: crudeCommit.committerEmail,
		subjectLine: tokeniseSubjectLine(crudeSubjectLine, configuration.tokens),
		bodyLines: crudeBodyLines.map((crudeBodyLine) =>
			tokeniseBodyLine(crudeBodyLine, configuration.tokens),
		),
	}
}

function tokeniseSubjectLine(
	crudeSubjectLine: string,
	configuration: TokenConfiguration,
): TokenisedLine {
	// oxfmt-ignore
	return (
		tokeniseDependencyVersions(
			tokeniseIssueLinks(
				tokeniseInlineCodePhrases(
					tokeniseRevertMarkers(
						tokeniseSquashMarkers(
							[text(crudeSubjectLine, [0, crudeSubjectLine.length])],
						)
					),
				),
				configuration,
			),
		)
	).filter(notEmptyToken)
}

function tokeniseBodyLine(
	crudeBodyLine: string,
	_configuration: TokenConfiguration,
): TokenisedLine {
	// oxfmt-ignore
	return (
		[text(crudeBodyLine, [0, crudeBodyLine.length])]
	).filter(notEmptyToken)
}

function notEmptyToken(token: Token): boolean {
	return token.value !== ""
}
