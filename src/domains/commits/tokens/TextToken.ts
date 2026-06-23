import type { CharacterRange } from "#types/CharacterRange.ts"

export type TextToken = {
	type: "text"
	value: string
	range: CharacterRange
}

export function text(value: string, rangeStart = 0): TextToken {
	return {
		type: "text",
		value,
		range: [rangeStart, rangeStart + value.length],
	}
}

export function slicedText(token: TextToken, start = 0, end?: number): TextToken {
	const [oldStartIndex] = token.range
	const slicedValue = token.value.slice(start, end)
	return text(slicedValue, oldStartIndex + start)
}
