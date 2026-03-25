import type { Commit, Commits } from "#commits/Commit.ts"
import { isSquashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import type { RuleKey } from "#configurations/Configuration.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

const rule: RuleKey = "noSquashMarkers"

export function noSquashMarkers(commits: Commits, configuration: EmptyObject | null): Concerns {
	return configuration !== null ? commits.map(verifyCommit).filter(notNullish) : []
}

function verifyCommit(commit: Commit): Concern | null {
	const [firstToken] = commit.subjectLine

	if (firstToken && isSquashMarker(firstToken)) {
		const leadingWhitespaceOffset = firstToken.value.length - firstToken.value.trimStart().length
		const trimmedTokenLength = firstToken.value.trim().length

		return subjectLineConcern(rule, commit.sha, {
			range: [leadingWhitespaceOffset, leadingWhitespaceOffset + trimmedTokenLength],
		})
	}

	return null
}
