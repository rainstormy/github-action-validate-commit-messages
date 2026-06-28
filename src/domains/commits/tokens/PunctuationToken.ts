import { type Token, tokenOf } from "#commits/tokens/Token.ts"

export function punctuation(value: string, rangeStart = 0): Token {
	return tokenOf("punctuation", value, rangeStart)
}
