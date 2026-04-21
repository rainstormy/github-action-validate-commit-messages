import { slicedText } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"

export type RevertMarkerToken = {
	type: "revert-marker"
	value: string
}

export function revertMarker(value: string): RevertMarkerToken {
	return { type: "revert-marker", value }
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

			result.push(revertMarker(match), slicedText(token, match.length))
		} else {
			result.push(token)
		}
	}

	return result
}
