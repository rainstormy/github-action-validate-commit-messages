import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { type RuleContext, ruleContext } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

/**
 * Verifies that the subject line starts with an uppercase letter.
 *
 * Standardising the commit message format helps to preserve the readability of the commit history.
 *
 * It ignores commits that do not start with a letter.
 * It disregards issue links, inline code phrases, revert markers, and squash markers.
 */
export function useCapitalisedSubjectLines(
	commits: Commits,
	options: EmptyObject | null,
): Concerns {
	if (options === null) {
		return []
	}

	const rule = ruleContext("useCapitalisedSubjectLines")
	return commits.map((commit) => verifyCommit(commit, rule)).filter(notNullish)
}

function verifyCommit(commit: Commit, rule: RuleContext): Concern | null {
	let index = 0

	for (const token of commit.subjectLine) {
		if (token.type === "text") {
			const trimmedToken = token.value.trimStart()

			if (startsWithLowercaseLetter(trimmedToken)) {
				const leadingWhitespaceOffset = token.value.length - trimmedToken.length
				const startIndex = index + leadingWhitespaceOffset

				return subjectLineConcern(rule, commit.sha, {
					range: [startIndex, startIndex + 1],
				})
			}

			return null
		}

		index += token.value.length
	}

	return null
}

function startsWithLowercaseLetter(token: string): boolean {
	const firstCharacter = token[0] ?? ""
	return firstCharacter !== firstCharacter.toUpperCase()
}
