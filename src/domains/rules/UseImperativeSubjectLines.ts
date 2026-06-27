import type { Commit, Commits } from "#commits/Commit.ts"
import { type Token, type TokenisedLine, isPlainToken } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
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
export function* useImperativeSubjectLines(
	commits: Commits,
	options: { whitelist: Array<string> } | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	const whitelist = new Set(options.whitelist.map(normaliseWord))

	for (const commit of commits) {
		yield* getCommitConcerns(commit, whitelist)
	}
}

function* getCommitConcerns(commit: Commit, whitelist: Set<string>): Generator<Concern> {
	const firstWord = getFirstWord(commit.subjectLine)

	if (firstWord === null) {
		return
	}

	const normalisedFirstWord = normaliseWord(firstWord.value)

	if (whitelist.has(normalisedFirstWord) || isImperativeVerb(normalisedFirstWord)) {
		return
	}

	yield subjectLineConcern(rule, commit.sha, { range: firstWord.range })
}

type WordCandidate = {
	value: string
	range: CharacterRange
}

function getFirstWord(tokens: TokenisedLine): WordCandidate | null {
	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens[index]

		if (token === undefined) {
			return null
		}
		if (token.type === "revert-marker") {
			return null
		}
		if (
			token.type !== "issue-link" &&
			token.type !== "squash-marker" &&
			token.type !== "whitespace"
		) {
			return isPlainToken(token) ? getFirstPlainWord(tokens, index) : getFirstWordInToken(token)
		}
	}

	return null
}

function getFirstPlainWord(tokens: TokenisedLine, startIndex: number): WordCandidate | null {
	const firstToken = tokens[startIndex]

	if (firstToken === undefined) {
		return null
	}

	let value = firstToken.value
	let range: CharacterRange = firstToken.range

	for (let index = startIndex + 1; index < tokens.length; index += 1) {
		const token = tokens[index]

		if (token === undefined || !isPlainToken(token) || token.type === "whitespace") {
			break
		}

		value += token.value
		range = [range[0], token.range[1]]
	}

	return { value, range }
}

const firstWordRegex = /\S+/u

function getFirstWordInToken(token: Token): WordCandidate | null {
	const firstWord = firstWordRegex.exec(token.value)?.[0] ?? null

	if (firstWord === null) {
		return null
	}

	const wordStartIndex = token.range[0] + token.value.indexOf(firstWord)

	return {
		value: firstWord,
		range: [wordStartIndex, wordStartIndex + firstWord.length],
	}
}

function normaliseWord(word: string): string {
	return word.trim().toLowerCase()
}
