import { slicedText } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export type RevertMarkerToken = {
	type: "revert-marker"
	value: string
	range: CharacterRange
}

export function revertMarker(value: string, range: CharacterRange): RevertMarkerToken {
	return { type: "revert-marker", value, range }
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

			const [tokenStartIndex] = token.range
			result.push(
				revertMarker(match, [tokenStartIndex, tokenStartIndex + match.length]),
				slicedText(token, match.length),
			)
		} else {
			result.push(token)
		}
	}

	return result
}
