import { slicedText } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
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
	range: CharacterRange,
): RevertMarkerToken {
	return { type: "revert-marker", value, occurrences, range }
}

// Assume all revert markers to contain a double quote `"` followed by a non-quote character (quote pair consistency not enforced for simplicity).
const regex = /^(?:\s*revert\s+")+(?=[^"])/iu

export function tokeniseRevertMarkers(initialTokens: TokenisedLine): TokenisedLine {
	const result: TokenisedLine = []
	let isFirstTextToken = true

	for (const token of initialTokens) {
		if (token.type === "text" && isFirstTextToken) {
			isFirstTextToken = false
			const match = regex.exec(token.value)?.[0] ?? null

			// Revert markers must appear at the beginning of the line (disregarding tokens with higher priority such as squash markers).
			if (match === null) {
				return initialTokens
			}

			const occurrences = countOccurrences(match, "revert", { caseInsensitive: true })

			// Extract no more trailing double quotes than there are 'revert' occurrences.
			const trailerRegex = new RegExp(String.raw`("\s*){1,${occurrences}}$`, "gu")
			const trailer = trailerRegex.exec(token.value)?.[0] ?? null

			const [oldStartIndex, oldEndIndex] = token.range

			result.push(
				revertMarker(match, occurrences, [oldStartIndex, oldStartIndex + match.length]),
				slicedText(token, match.length, trailer !== null ? -trailer.length : undefined),
			)

			if (trailer !== null) {
				result.push(revertMarker(trailer, 0, [oldEndIndex - trailer.length, oldEndIndex]))
			}
		} else {
			result.push(token)
		}
	}

	return result
}
