import { type Token, tokenOf } from "#commits/tokens/Token.ts"

export function hyperlink(value: string, rangeStart = 0): Token {
	return tokenOf("hyperlink", value, rangeStart)
}
