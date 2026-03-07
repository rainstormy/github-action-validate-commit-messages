import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

const ruleName = "useCapitalisedSubjectLines"

export function useCapitalisedSubjectLines(
	commits: Commits,
	configuration: EmptyObject | null,
): Concerns {
	return configuration !== null
		? commits.map(verifyCommit).filter(notNullish)
		: []
}

function verifyCommit(commit: Commit): Concern | null {
	let index = 0

	for (const token of commit.subjectLine) {
		if (typeof token === "string") {
			const trimmedToken = token.trimStart()

			if (startsWithLowercaseLetter(trimmedToken)) {
				const leadingWhitespaceOffset = token.length - trimmedToken.length
				const startIndex = index + leadingWhitespaceOffset

				return subjectLineConcern(ruleName, commit.sha, [
					startIndex,
					startIndex + 1,
				])
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
