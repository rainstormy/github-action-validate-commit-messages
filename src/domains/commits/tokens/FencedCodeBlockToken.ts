import { type TokenisedLines, formatTokenisedLine } from "#commits/tokens/Token.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export type FencedCodeBlockToken = {
	type: "fenced-code-block"
	value: string
	range: CharacterRange
}

export function fencedCodeBlock(value: string, range: CharacterRange): FencedCodeBlockToken {
	return { type: "fenced-code-block", value, range }
}

export function rawFencedCodeBlockToken(value: string): FencedCodeBlockToken {
	return fencedCodeBlock(value, [0, value.length])
}

export function tokeniseFencedCodeBlocks(initialBodyLines: TokenisedLines): TokenisedLines {
	const result: TokenisedLines = []
	let currentFence: Fence | null = null

	for (const bodyLine of initialBodyLines) {
		// A fenced code block cannot appear on a line that has other tokens.
		if (bodyLine.length === 1 && bodyLine[0]?.type !== "text") {
			break
		}

		const bodyLineString = formatTokenisedLine(bodyLine)

		if (currentFence !== null) {
			result.push([rawFencedCodeBlockToken(bodyLineString)])

			if (isClosingFence(bodyLineString, currentFence)) {
				currentFence = null
			}
		} else {
			const openingFence = getOpeningFence(bodyLineString)

			if (openingFence !== null) {
				result.push([rawFencedCodeBlockToken(bodyLineString)])
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
