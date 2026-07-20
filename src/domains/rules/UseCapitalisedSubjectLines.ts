import type { Commits } from "#commits/Commit.ts"
import { type Token, isToken } from "#commits/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "useCapitalisedSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line starts with an uppercase letter.
 *
 * Standardising the commit message format helps to preserve the readability of the commit history.
 *
 * It ignores commits that do not start with a letter.
 * It disregards issue links, inline code phrases, and squash markers.
 */
export function* useCapitalisedSubjectLines(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		const firstToken = commit.subjectLine.find(isToken("punctuation", "revert", "word"))

		if (firstToken && startsWithLowercaseLetter(firstToken)) {
			const rangeStart = firstToken.range[0]
			yield subjectLineConcern(rule, commit.sha, { range: [rangeStart, rangeStart + 1] })
		}
	}
}

function startsWithLowercaseLetter(token: Token): boolean {
	const firstCharacter = token.value.trimStart()[0] ?? ""
	return firstCharacter !== firstCharacter.toUpperCase()
}
