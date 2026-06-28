import {
	type TokenisedLine,
	formatTokenisedLine,
	tokenisePlainText,
	tokeniseStructuredText,
} from "#commits/tokens/Token.ts"

export function squashMarker(value: string, rangeStart = 0): TokenisedLine {
	return tokeniseStructuredText("squash-marker", value, rangeStart)
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

		return [...squashMarker(match), ...tokenisePlainText(line.slice(match.length), match.length)]
	}

	return initialTokens
}
