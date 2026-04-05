import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import { tokeniseDependencyVersions } from "#commits/tokens/DependencyVersionToken.ts"
import { tokeniseIssueLinks } from "#commits/tokens/IssueLinkToken.ts"
import { tokeniseRevertMarkers } from "#commits/tokens/RevertMarkerToken.ts"
import { tokeniseSquashMarkers } from "#commits/tokens/SquashMarkerToken.ts"
import type { TokenisedLine, TokenisedLines } from "#commits/tokens/Token.ts"
import type { Configuration, TokenConfiguration } from "#configurations/Configuration.ts"
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
		subjectLine: tokeniseSubjectLine(crudeSubjectLine, configuration.tokens).filter(notEmptyString),
		bodyLines: crudeBodyLines.map((crudeBodyLine) => [crudeBodyLine].filter(notEmptyString)),
	}
}

function tokeniseSubjectLine(
	crudeSubjectLine: string,
	tokenConfiguration: TokenConfiguration,
): TokenisedLine {
	return tokeniseDependencyVersions(
		tokeniseIssueLinks(
			tokeniseRevertMarkers(tokeniseSquashMarkers([crudeSubjectLine])),
			tokenConfiguration,
		),
	)
}
