import type { TokenisedLine } from "#commits/Commit.ts"

export type SquashMarkerToken = {
	type: "squash-marker"
	value: string
}

export function squashMarker(value: string): SquashMarkerToken {
	return { type: "squash-marker", value }
}

const regex =
	/^\s*(?:amend!+\s*|fixup!+\s*|squash!+\s*|!amend\b\s*|!fixup\b\s*|!squash\b\s*)+/iu

export function tokeniseSquashMarkers(
	initialTokens: TokenisedLine,
): TokenisedLine {
	const [firstToken, ...remainingTokens] = initialTokens

	// Squash markers must appear at the beginning of the line.
	if (typeof firstToken !== "string") {
		return initialTokens
	}

	const match = regex.exec(firstToken)?.[0] ?? null

	if (match === null) {
		return initialTokens
	}

	return [
		squashMarker(match),
		firstToken.slice(match.length),
		...remainingTokens,
	]
}
