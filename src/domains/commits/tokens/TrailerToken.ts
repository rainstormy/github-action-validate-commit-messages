import {
	type Token,
	type TokenisedLine,
	type TokenisedLines,
	formatTokenisedLine,
	isPlainToken,
	tokeniseStructuredText,
} from "#commits/tokens/Token.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export function trailer(key: string, value: string, rangeStart = 0): TokenisedLine {
	return [...trailerKey(key, rangeStart), ...trailerValue(value, rangeStart + key.length)]
}

export function trailerKey(value: string, rangeStart = 0): TokenisedLine {
	return tokeniseStructuredText("trailer-key", value, rangeStart)
}

export function trailerValue(value: string, rangeStart = 0): TokenisedLine {
	return tokeniseStructuredText("trailer-value", value, rangeStart)
}

/**
 * Matches a colon-separated key-value pair in one of the following formats:
 *
 * - Git-style trailers (e.g. `Co-authored-by: Ada <ada@example.com>`).
 * - Conventional Commits breaking change (e.g. `BREAKING CHANGE: Removed the old API`).
 *
 * @see https://git-scm.com/docs/git-interpret-trailers
 * @see https://www.conventionalcommits.org
 */
const regex = /^(\s*(?:[a-z0-9-]+|breaking change)\s*:\s*)(.*)$/iu

export function tokeniseTrailers(initialBodyLines: TokenisedLines): TokenisedLines {
	const trailersAndBlankLines: TokenisedLines = []

	for (let i = initialBodyLines.length - 1; i >= 0; i -= 1) {
		const bodyLine = initialBodyLines[i] ?? []

		// A trailer cannot appear on a line that has other tokens.
		if (bodyLine.some((token) => !isPlainToken(token))) {
			break
		}

		const bodyLineString = formatTokenisedLine(bodyLine)
		const [, key = null, value = null] = regex.exec(bodyLineString) ?? []

		if (key !== null && value !== null) {
			trailersAndBlankLines.push(trailer(key, value))
		} else if (bodyLineString.trim() === "") {
			trailersAndBlankLines.push(bodyLine)
		} else {
			break // Stop processing trailers when a non-blank, non-trailer line is encountered.
		}
	}

	if (trailersAndBlankLines.length === 0) {
		return initialBodyLines
	}

	trailersAndBlankLines.reverse()
	return [...initialBodyLines.slice(0, -trailersAndBlankLines.length), ...trailersAndBlankLines]
}

export function trimmedTrailerTokenKeyRange(token: Token): CharacterRange {
	const [untrimmedStart] = token.range
	const leadingOffset = token.value.length - token.value.trimStart().length
	return [untrimmedStart + leadingOffset, untrimmedStart + token.value.trimEnd().length]
}
