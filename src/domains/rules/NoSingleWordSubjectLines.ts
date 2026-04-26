import type { Commit, Commits } from "#commits/Commit.ts"
import { type Token, trimmedTokenRange } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { type RuleContext, ruleContext } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notEmptyString, notNullish } from "#utilities/Arrays.ts"

/**
 * Verifies that the subject line contains at least two words.
 *
 * Providing more context in the commit message (such as a thorough description) helps to preserve
 * the traceability of the commit history.
 *
 * Leading issue links, revert markers, and squash markers do not count as words.
 */
export function noSingleWordSubjectLines(commits: Commits, options: EmptyObject | null): Concerns {
	if (options === null) {
		return []
	}

	const rule = ruleContext("noSingleWordSubjectLines")
	return commits.map((commit) => verifyCommit(commit, rule)).filter(notNullish)
}

function verifyCommit(commit: Commit, rule: RuleContext): Concern | null {
	let words = 0
	let firstWordToken: Token | null = null

	for (const token of commit.subjectLine) {
		if (words > 1 || (token.type === "issue-link" && words > 0)) {
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
		return subjectLineConcern(rule, commit.sha, {
			range: trimmedTokenRange(firstWordToken),
		})
	}

	return null
}

const intoWords = /\s+/gu

function countWords(token: string): number {
	return token.split(intoWords).filter(notEmptyString).length
}
