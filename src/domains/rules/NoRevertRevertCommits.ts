import type { Commit, Commits } from "#commits/Commit.ts"
import { isRevertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { isSquashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { type RuleContext, ruleContext } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

export function noRevertRevertCommits(commits: Commits, options: EmptyObject | null): Concerns {
	const rule = ruleContext("noRevertRevertCommits", options)

	return options !== null
		? commits.map((commit) => verifyCommit(commit, rule)).filter(notNullish)
		: []
}

function verifyCommit(commit: Commit, rule: RuleContext): Concern | null {
	for (const token of commit.subjectLine) {
		if (isSquashMarker(token)) {
			return null
		}
		if (isRevertMarker(token)) {
			const revertOccurrences = (token.value.match(/revert/giu) ?? []).length

			if (revertOccurrences > 1) {
				const leadingWhitespaceOffset = token.value.length - token.value.trimStart().length
				const trimmedTokenLength = token.value.trim().length

				return subjectLineConcern(rule, commit.sha, {
					range: [leadingWhitespaceOffset, leadingWhitespaceOffset + trimmedTokenLength],
				})
			}
		}
	}

	return null
}
