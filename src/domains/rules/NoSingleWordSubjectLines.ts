import type { Commit, Commits } from "#commits/Commit.ts"
import { type Token, trimmedTokenRange } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notEmptyString, notNullish } from "#utilities/Arrays.ts"

const rule = "noSingleWordSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line contains at least two words.
 *
 * Providing more context in the commit message (such as a thorough description) helps to preserve
 * the traceability of the commit history.
 *
 * It ignores commits with revert markers.
 * Leading issue links and squash markers do not count as words.
 */
export function noSingleWordSubjectLines(commits: Commits, options: EmptyObject | null): Concerns {
	return options !== null ? commits.map(verifyCommit).filter(notNullish) : []
}

function verifyCommit(commit: Commit): Concern | null {
	let words = 0
	let firstWordToken: Token | null = null

	for (const token of commit.subjectLine) {
		if (words > 1 || (token.type === "issue-link" && words > 0) || token.type === "revert-marker") {
			return null
		}
		if (
			token.type === "dependency-version" ||
			token.type === "inline-code" ||
			token.type === "text"
		) {
			words += countWords(token.value)
			firstWordToken = token
		}
	}

	if (words === 1 && firstWordToken !== null) {
		return subjectLineConcern(rule, commit.sha, { range: trimmedTokenRange(firstWordToken) })
	}

	return null
}

const intoWords = /\s+/gu

function countWords(token: string): number {
	return token.split(intoWords).filter(notEmptyString).length
}
