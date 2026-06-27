import {
	type TokenisedLine,
	formatTokenisedLine,
	isPlainToken,
	tokenisePlainText,
} from "#commits/tokens/Token.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import { countOccurrences } from "#utilities/Strings.ts"

export type RevertMarkerToken = {
	type: "revert-marker"
	value: string
	occurrences: number
	range: CharacterRange
}

export function revertMarker(
	value: string,
	occurrences: number,
	rangeStart = 0,
): RevertMarkerToken {
	return {
		type: "revert-marker",
		value,
		occurrences,
		range: [rangeStart, rangeStart + value.length],
	}
}

// Assume all revert markers to contain an opening double quote `"` (quote pair consistency not enforced for simplicity).
const regex = /^(?:\s*revert\s+")+/iu

export function tokeniseRevertMarkers(initialTokens: TokenisedLine): TokenisedLine {
	const firstPlainSpan = getFirstPlainTokenSpan(initialTokens)

	if (firstPlainSpan === null) {
		return initialTokens
	}

	const { beforeTokens, plainTokens, afterTokens } = firstPlainSpan
	const plainText = formatTokenisedLine(plainTokens)
	const match = regex.exec(plainText)?.[0] ?? null

	// Revert markers must appear at the beginning of the line (disregarding tokens with higher priority such as squash markers).
	if (match === null) {
		return initialTokens
	}

	const occurrences = countOccurrences(match, "revert", { caseInsensitive: true })

	// Extract no more trailing double quotes than there are 'revert' occurrences.
	const trailerRegex = new RegExp(String.raw`("\s*){1,${occurrences}}$`, "gu")
	const trailer = trailerRegex.exec(plainText.slice(match.length))?.[0] ?? null
	const [plainStartIndex, plainEndIndex] = getTokenSpanRange(plainTokens)

	return [
		...beforeTokens,
		revertMarker(match, occurrences, plainStartIndex),
		...tokenisePlainText(
			plainText.slice(match.length, trailer !== null ? -trailer.length : undefined),
			plainStartIndex + match.length,
		),
		...(trailer !== null ? [revertMarker(trailer, 0, plainEndIndex - trailer.length)] : []),
		...afterTokens,
	]
}

type FirstPlainTokenSpan = {
	beforeTokens: TokenisedLine
	plainTokens: TokenisedLine
	afterTokens: TokenisedLine
}

function getFirstPlainTokenSpan(tokens: TokenisedLine): FirstPlainTokenSpan | null {
	const plainStartIndex = tokens.findIndex(isPlainToken)

	if (plainStartIndex === -1) {
		return null
	}

	const plainEndIndex = tokens.findIndex(
		(token, index) => index > plainStartIndex && !isPlainToken(token),
	)
	const exclusivePlainEndIndex = plainEndIndex === -1 ? tokens.length : plainEndIndex

	return {
		beforeTokens: tokens.slice(0, plainStartIndex),
		plainTokens: tokens.slice(plainStartIndex, exclusivePlainEndIndex),
		afterTokens: tokens.slice(exclusivePlainEndIndex),
	}
}

function getTokenSpanRange(tokens: TokenisedLine): CharacterRange {
	const [firstToken] = tokens
	const lastToken = tokens.at(-1)

	if (firstToken === undefined || lastToken === undefined) {
		return [0, 0]
	}

	return [firstToken.range[0], lastToken.range[1]]
}
