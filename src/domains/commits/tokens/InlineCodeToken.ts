import { text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"

export type InlineCodeToken = {
	type: "inline-code"
	value: string
}

export function inlineCode(value: string): InlineCodeToken {
	return { type: "inline-code", value }
}

/**
 * Matches an inline code phrase enclosed in a pair of backticks (e.g. Markdown inline code).
 */
const regex = /(`[^`]*`)/gu

export function tokeniseInlineCodePhrases(initialTokens: TokenisedLine): TokenisedLine {
	const result: TokenisedLine = []

	for (const token of initialTokens) {
		if (token.type === "text") {
			result.push(
				...token.value
					.split(regex)
					// `split()` with a regex preserves the string delimiter (i.e. the substrings that match the regex).
					// Every other item in the array is a match.
					.map((part, index) => (index % 2 === 1 ? inlineCode(part) : text(part))),
			)
		} else {
			result.push(token)
		}
	}

	return result
}
