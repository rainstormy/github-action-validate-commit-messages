import { type TokenisedLines, formatTokenisedLine } from "#commits/tokens/Token.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export type TrailerToken = {
	type: "trailer"
	key: string
	value: string
	range: CharacterRange
}

export function trailer(key: string, value: string, range: CharacterRange): TrailerToken {
	return { type: "trailer", key, value, range }
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
		if (bodyLine.length === 1 && bodyLine[0]?.type !== "text") {
			break
		}

		const bodyLineString = formatTokenisedLine(bodyLine)
		const [, key = null, value = null] = regex.exec(bodyLineString) ?? []

		if (key !== null && value !== null) {
			trailersAndBlankLines.push([trailer(key, value, [0, bodyLineString.length])])
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

export function trimmedTrailerTokenKeyRange(token: TrailerToken): CharacterRange {
	const [untrimmedStart] = token.range
	const leadingOffset = token.key.length - token.key.trimStart().length
	return [untrimmedStart + leadingOffset, untrimmedStart + token.key.trimEnd().length]
}
