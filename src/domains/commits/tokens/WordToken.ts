import { type Token, tokenOf } from "#commits/tokens/Token.ts"

export function word(value: string, rangeStart = 0): Token {
	return tokenOf("word", value, rangeStart)
}
