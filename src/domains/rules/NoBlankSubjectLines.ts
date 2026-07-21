import type { Commits } from "#commits/Commit.ts"
import { isToken, tokenRangeEnd } from "#commits/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { nonEmptyRangeOf } from "#types/CharacterRange.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noBlankSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line contains at least one alphanumeric character.
 *
 * Including a subject line makes the commit distinguishable from other commits.
 * This helps to preserve the readability of the commit history.
 *
 * Issue links, revert markers, and squash markers do not count as alphanumeric characters.
 */
export function* noBlankSubjectLines(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		if (
			commit.subjectLine.some(isToken("semver", "word")) ||
			commit.subjectLine.some((token) => token.type === "code" && token.value !== "``")
		) {
			continue
		}

		const firstBlankIndex =
			commit.subjectLine.findLastIndex(isToken("issuelink", "revert", "squash")) + 1

		const blankEnd = tokenRangeEnd(commit.subjectLine)
		const blankStart =
			firstBlankIndex !== -1 ? (commit.subjectLine[firstBlankIndex]?.range[0] ?? blankEnd) : 0

		yield subjectLineConcern(rule, commit.sha, { range: nonEmptyRangeOf(blankStart, blankEnd) })
	}
}
