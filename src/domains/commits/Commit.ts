import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import { tokeniseIssueLinks } from "#commits/tokens/IssueLinkToken.ts"
import { tokeniseSquashMarkers } from "#commits/tokens/SquashMarkerToken.ts"
import type {
	TokenisedLine,
	TokenisedLines,
	Tokenisers,
} from "#commits/tokens/Token.ts"
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
