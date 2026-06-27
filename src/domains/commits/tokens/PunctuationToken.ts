import type { CharacterRange } from "#types/CharacterRange.ts"

export type PunctuationToken = {
	type: "punctuation"
	value: string
	range: CharacterRange
}

export function punctuation(value: string, rangeStart = 0): PunctuationToken {
	return {
		type: "punctuation",
		value,
		range: [rangeStart, rangeStart + value.length],
	}
}
