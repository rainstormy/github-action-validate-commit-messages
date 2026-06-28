import type { Commit, Commits } from "#commits/Commit.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

const rule = "noRestrictedTrailers" satisfies RuleKey

/**
 * Verifies that the message body does not contain trailers with certain keys.
 *
 * For example, disallowing `Co-authored-by` trailers helps to keep the commit history attributable,
 * as co-authors are unable to sign commits. It also rejects commits made from code review suggestions through the GitHub web interface.
 */
export function* noRestrictedTrailers(
	commits: Commits,
	options: { restrictedKeys: Array<string> } | null,
): Generator<Concern> {
	if (options === null || options.restrictedKeys.length === 0) {
		return
	}

	const restrictedKeys = new Set(options.restrictedKeys.map(normaliseTrailerKey))

	for (const commit of commits) {
		yield* getCommitConcerns(commit, restrictedKeys)
	}
}

function* getCommitConcerns(commit: Commit, restrictedKeys: Set<string>): Generator<Concern> {
	let line = 0

	for (const bodyLine of commit.bodyLines) {
		const trailerKey = getTrailerKey(bodyLine)

		if (trailerKey !== null && restrictedKeys.has(normaliseTrailerKey(trailerKey.value))) {
			yield bodyLineConcern(rule, commit.sha, { line, range: trailerKey.range })
		}

		line += 1
	}
}

type TrailerKey = {
	value: string
	range: CharacterRange
}

function getTrailerKey(bodyLine: TokenisedLine): TrailerKey | null {
	const firstKeyTokenIndex = bodyLine.findIndex((token) => token.type === "trailer-key")
	const firstKeyToken = bodyLine[firstKeyTokenIndex]

	if (firstKeyToken === undefined) {
		return null
	}

	let value = ""
	let lastKeyTokenEndIndex = firstKeyToken.range[1]

	for (const token of bodyLine.slice(firstKeyTokenIndex)) {
		if (token.type === "trailer-value") {
			break
		}

		value += token.value

		if (token.type === "trailer-key") {
			lastKeyTokenEndIndex = token.range[1]
		}
	}

	const [untrimmedStart] = firstKeyToken.range
	const leadingOffset = value.length - value.trimStart().length
	return {
		value,
		range: [untrimmedStart + leadingOffset, lastKeyTokenEndIndex],
	}
}

export function normaliseTrailerKey(key: string): string {
	const trimmedKey = key.trim().toLowerCase()
	return trimmedKey.endsWith(":") ? trimmedKey.slice(0, -":".length).trimEnd() : trimmedKey
}
