import type { Commit, Commits } from "#commits/Commit.ts"
import { isText } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { type RuleContext, ruleContext } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

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
		if (isText(token)) {
			const trimmedToken = token.trimStart()

			if (startsWithLowercaseLetter(trimmedToken)) {
				const leadingWhitespaceOffset = token.length - trimmedToken.length
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
