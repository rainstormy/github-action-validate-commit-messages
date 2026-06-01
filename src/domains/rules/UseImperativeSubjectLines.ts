import type { Commit, Commits } from "#commits/Commit.ts"
import { text } from "#commits/tokens/TextToken.ts"
import { type Token, trimmedTokenRange } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { notNullish } from "#utilities/Arrays.ts"
import { isImperativeVerb } from "#utilities/Verbs.ts"

const rule = "useImperativeSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line starts with a verb in the imperative mood.
 *
 * Standardising the commit message format helps to preserve the readability of the commit history.
 *
 * It ignores revert commits.
 * It disregards issue links and squash markers.
 */
export function useImperativeSubjectLines(
	commits: Commits,
	options: { whitelist: Array<string> } | null,
): Concerns {
	if (options === null) {
		return []
	}

	const whitelist = new Set(options.whitelist.map(normaliseWord))
	return commits.map((commit) => verifyCommit(commit, whitelist)).filter(notNullish)
}

function verifyCommit(commit: Commit, whitelist: Set<string>): Concern | null {
	let firstWordToken: Token | null = null

	for (const token of commit.subjectLine) {
		if (token.type === "revert-marker") {
			return null
		}
		if (firstWordToken === null && token.type !== "issue-link" && token.type !== "squash-marker") {
			firstWordToken = getFirstWordToken(token)
		}
	}

	if (firstWordToken === null) {
		return null
	}

	const firstWord = normaliseWord(firstWordToken.value)

	if (whitelist.has(firstWord) || isImperativeVerb(firstWord)) {
		return null
	}

	return subjectLineConcern(rule, commit.sha, { range: trimmedTokenRange(firstWordToken) })
}

const firstWordRegex = /\S+/u

function getFirstWordToken(token: Token): Token | null {
	const firstWord = firstWordRegex.exec(token.value)?.[0] ?? null

	if (firstWord === null) {
		return null
	}

	const firstWordStartIndex = token.range[0] + token.value.indexOf(firstWord)
	return text(firstWord, [firstWordStartIndex, firstWordStartIndex + firstWord.length])
}

function normaliseWord(word: string): string {
	return word.trim().toLowerCase()
}
