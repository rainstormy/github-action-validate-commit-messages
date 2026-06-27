import {
	type TokenisedLine,
	formatTokenisedLine,
	tokenisePlainText,
} from "#commits/tokens/Token.ts"
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
	if (firstToken !== undefined) {
		const line = formatTokenisedLine([firstToken, ...remainingTokens])
		const match = regex.exec(line)?.[0] ?? null

		if (match === null) {
			return initialTokens
		}

		return [squashMarker(match), ...tokenisePlainText(line.slice(match.length), match.length)]
	}

	return initialTokens
}
