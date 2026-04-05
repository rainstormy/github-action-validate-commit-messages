import type { Token, TokenisedLine } from "#commits/tokens/Token.ts"

export type RevertMarkerToken = {
	type: "revert-marker"
	value: string
}

export function revertMarker(value: string): RevertMarkerToken {
	return { type: "revert-marker", value }
}

export function isRevertMarker(token: Token): token is RevertMarkerToken {
	return typeof token === "object" && token.type === "revert-marker"
}

const regex = /^\s*(?:revert\s+")+(?=[^"])/iu

export function tokeniseRevertMarkers(initialTokens: TokenisedLine): TokenisedLine {
	const result: TokenisedLine = []
	let isFirstTextToken = true

	for (const token of initialTokens) {
		if (typeof token === "string" && isFirstTextToken) {
			isFirstTextToken = false
			const match = regex.exec(token)?.[0] ?? null

			// Revert markers must appear at the beginning of the line (disregarding tokens with higher priority such as squash markers).
			if (match === null) {
				return initialTokens
			}

			result.push(revertMarker(match), token.slice(match.length))
		} else {
			result.push(token)
		}
	}

	return result
}
