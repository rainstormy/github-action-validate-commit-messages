import { type Token, tokenOf } from "#commits/tokens/Token.ts"

export function space(rangeStart = 0): Token {
	return whitespace(" ", rangeStart)
}

export function whitespace(value: string, rangeStart = 0): Token {
	return tokenOf("whitespace", value, rangeStart)
}
