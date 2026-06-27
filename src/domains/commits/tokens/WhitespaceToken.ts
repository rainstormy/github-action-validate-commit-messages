import type { CharacterRange } from "#types/CharacterRange.ts"

export type WhitespaceToken = {
	type: "whitespace"
	value: string
	range: CharacterRange
}

export function whitespace(value: string, rangeStart = 0): WhitespaceToken {
	return {
		type: "whitespace",
		value,
		range: [rangeStart, rangeStart + value.length],
	}
}
