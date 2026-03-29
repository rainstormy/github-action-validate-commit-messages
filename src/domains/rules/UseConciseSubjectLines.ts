import type { Commit, Commits } from "#commits/Commit.ts"
import { isDependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { isRevertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { isSquashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { isText } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { type RuleContext, ruleContext } from "#rules/Rule.ts"
import { notNullish } from "#utilities/Arrays.ts"

/**
 * Verifies that the subject line does not exceed a given number of characters (default: 50 characters).
 *
 * Keeping the subject line short helps to preserve the readability of the commit history in various Git clients.
 *
 * It ignores merge commits and commits with dependency versions, revert markers, or squash markers.
 * Issue links and inline code phrases do not count towards the limit.
 */
export function useConciseSubjectLines(
	commits: Commits,
	options: { maxLength: number } | null,
): Concerns {
	if (options === null) {
		return []
	}

	const rule = ruleContext("useConciseSubjectLines", options)
	return commits.map((commit) => verifyCommit(commit, rule)).filter(notNullish)
}

function verifyCommit(commit: Commit, rule: RuleContext<"useConciseSubjectLines">): Concern | null {
	if (commit.isMergeCommit) {
		return null
	}

	const maxLength = rule.options.maxLength

	let textLength = 0
	let startOffset = 0
	let endOffset = 0
	let endOffsetPotential = 0

	for (const token of commit.subjectLine) {
		if (isDependencyVersion(token) || isRevertMarker(token) || isSquashMarker(token)) {
			return null
		}
		if (isText(token)) {
			textLength += token.length
			endOffset += endOffsetPotential
			endOffsetPotential = 0
		} else if (textLength <= maxLength) {
			startOffset += token.value.length
		} else {
			endOffsetPotential += token.value.length
		}
	}

	if (textLength > maxLength) {
		return subjectLineConcern(rule, commit.sha, {
			range: [startOffset + maxLength, startOffset + textLength + endOffset],
		})
	}

	return null
}
