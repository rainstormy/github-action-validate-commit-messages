import type { Commit, Commits } from "#commits/Commit.ts"
import { type Token, type TokenisedLine, isPlainToken } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

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
export function* noSingleWordSubjectLines(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		yield* getCommitConcerns(commit)
	}
}

function* getCommitConcerns(commit: Commit): Generator<Concern> {
	const wordRanges = getWordRanges(commit.subjectLine)

	if (wordRanges.length === 1) {
		const [range] = wordRanges

		if (range !== undefined) {
			yield subjectLineConcern(rule, commit.sha, { range })
		}
	}
}

function getWordRanges(tokens: TokenisedLine): Array<CharacterRange> {
	const wordRanges: Array<CharacterRange> = []
	let activePlainWordIndex: number | null = null

	for (const token of tokens) {
		if (token.type === "revert" || (token.type === "issuelink" && wordRanges.length > 0)) {
			return []
		}
		if (token.type === "whitespace") {
			activePlainWordIndex = null
		} else if (token.type === "semver" || token.type === "code") {
			activePlainWordIndex = null
			wordRanges.push(...getSpecialTokenWordRanges(token))
		} else if (isPlainToken(token)) {
			if (activePlainWordIndex === null) {
				wordRanges.push(token.range)
				activePlainWordIndex = wordRanges.length - 1
			} else {
				const [startIndex] = wordRanges[activePlainWordIndex] ?? token.range
				wordRanges[activePlainWordIndex] = [startIndex, token.range[1]]
			}
		}
	}

	return wordRanges
}

const intoWords = /\S+/gu

function getSpecialTokenWordRanges(token: Token): Array<CharacterRange> {
	return [...token.value.matchAll(intoWords)].map((match) => {
		const value = match[0]
		const startIndex = token.range[0] + match.index

		return [startIndex, startIndex + value.length]
	})
}
