import {
	type Token,
	type TokenisedLines,
	formatTokenisedLine,
	isPlainToken,
	tokenOf,
} from "#commits/tokens/Token.ts"

export function fencedCodeBlock(value: string, rangeStart = 0): Token {
	return tokenOf("fenced-code-block", value, rangeStart)
}

export function tokeniseFencedCodeBlocks(initialBodyLines: TokenisedLines): TokenisedLines {
	const result: TokenisedLines = []
	let currentFence: Fence | null = null

	for (const bodyLine of initialBodyLines) {
		// A fenced code block cannot appear on a line that has other tokens.
		if (bodyLine.some((token) => !isPlainToken(token))) {
			break
		}

		const bodyLineString = formatTokenisedLine(bodyLine)

		if (currentFence !== null) {
			result.push([fencedCodeBlock(bodyLineString)])

			if (isClosingFence(bodyLineString, currentFence)) {
				currentFence = null
			}
		} else {
			const openingFence = getOpeningFence(bodyLineString)

			if (openingFence !== null) {
				result.push([fencedCodeBlock(bodyLineString)])
				currentFence = openingFence
			} else {
				result.push(bodyLine)
			}
		}
	}

	return result
}

type Fence = "```" | "````"

function getOpeningFence(value: string): Fence | null {
	return value.startsWith("````") ? "````" : value.startsWith("```") ? "```" : null
}

function isClosingFence(value: string, currentFence: Fence): boolean {
	return value.startsWith(currentFence)
}
