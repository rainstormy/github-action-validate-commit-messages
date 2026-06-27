import type { CharacterRange } from "#types/CharacterRange.ts"

export type WordToken = {
	type: "word"
	value: string
	range: CharacterRange
}

export function word(value: string, rangeStart = 0): WordToken {
	return {
		type: "word",
		value,
		range: [rangeStart, rangeStart + value.length],
	}
}
