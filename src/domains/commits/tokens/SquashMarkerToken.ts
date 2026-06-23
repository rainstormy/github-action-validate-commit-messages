import { slicedText } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export type SquashMarkerToken = {
	type: "squash-marker"
	value: string
	range: CharacterRange
}

export function squashMarker(value: string, rangeStart = 0): SquashMarkerToken {
	return {
		type: "squash-marker",
		value,
		range: [rangeStart, rangeStart + value.length],
	}
}

const regex = /^\s*(?:amend!+\s*|fixup!+\s*|squash!+\s*|!amend\b\s*|!fixup\b\s*|!squash\b\s*)+/iu

export function tokeniseSquashMarkers(initialTokens: TokenisedLine): TokenisedLine {
	const [firstToken, ...remainingTokens] = initialTokens

	// Squash markers must appear at the beginning of the line.
	if (firstToken?.type === "text") {
		const match = regex.exec(firstToken.value)?.[0] ?? null

		if (match === null) {
			return initialTokens
		}

		return [squashMarker(match), slicedText(firstToken, match.length), ...remainingTokens]
	}

	return initialTokens
}
