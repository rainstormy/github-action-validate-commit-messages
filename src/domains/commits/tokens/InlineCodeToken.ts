import type { Token, TokenisedLine } from "#commits/tokens/Token.ts"

export type InlineCodeToken = {
	type: "inline-code"
	value: string
}

export function inlineCode(value: string): InlineCodeToken {
	return { type: "inline-code", value }
}

export function isInlineCode(token: Token): token is InlineCodeToken {
	return typeof token === "object" && token.type === "inline-code"
}

/**
 * Matches an inline code phrase enclosed in a pair of backticks (e.g. Markdown inline code).
 */
const regex = /(`[^`]*`)/gu

export function tokeniseInlineCodePhrases(initialTokens: TokenisedLine): TokenisedLine {
	const result: TokenisedLine = []

	for (const token of initialTokens) {
		if (typeof token === "string") {
			result.push(
				...token
					.split(regex)
					// `split()` with a regex preserves the string delimiter (i.e. the substrings that match the regex).
					// Every other item in the array is a match.
					.map((part, index) => (index % 2 === 1 ? inlineCode(part) : part)),
			)
		} else {
			result.push(token)
		}
	}

	return result
}
