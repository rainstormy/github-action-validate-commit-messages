import { type Token, type TokenisedLine, splitPlainTokens, tokenOf } from "#commits/tokens/Token.ts"

export function inlineCode(value: string, rangeStart = 0): Token {
	return tokenOf("inline-code", value, rangeStart)
}

/**
 * Matches an inline code phrase enclosed in a pair of backticks (e.g. Markdown inline code).
 */
const regex = /(`[^`]*`)/gu

export function tokeniseInlineCodePhrases(initialTokens: TokenisedLine): TokenisedLine {
	return splitPlainTokens(initialTokens, regex, inlineCode)
}
