import { type TokenisedLine, splitTextTokens } from "#commits/tokens/Token.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export type InlineCodeToken = {
	type: "inline-code"
	value: string
	range: CharacterRange
}

export function inlineCode(value: string, range: CharacterRange): InlineCodeToken {
	return { type: "inline-code", value, range }
}

/**
 * Matches an inline code phrase enclosed in a pair of backticks (e.g. Markdown inline code).
 */
const regex = /(`[^`]*`)/gu

export function tokeniseInlineCodePhrases(initialTokens: TokenisedLine): TokenisedLine {
	return splitTextTokens(initialTokens, regex, inlineCode)
}
