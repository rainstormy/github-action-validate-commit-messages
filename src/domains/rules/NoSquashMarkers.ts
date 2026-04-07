import type { Commit, Commits } from "#commits/Commit.ts"
import { isSquashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { type RuleContext, ruleContext } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

export function noSquashMarkers(commits: Commits, options: EmptyObject | null): Concerns {
	if (options === null) {
		return []
	}

	const rule = ruleContext("noSquashMarkers")
	return commits.map((commit) => verifyCommit(commit, rule)).filter(notNullish)
}

function verifyCommit(commit: Commit, rule: RuleContext): Concern | null {
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
