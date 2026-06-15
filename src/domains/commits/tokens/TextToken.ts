import type { CharacterRange } from "#types/CharacterRange.ts"

export type TextToken = {
	type: "text"
	value: string
	range: CharacterRange
}

export function text(value: string, range: CharacterRange): TextToken {
	return { type: "text", value, range }
}

export function slicedText(token: TextToken, start = 0, end?: number): TextToken {
	const [oldStartIndex] = token.range
	const slicedValue = token.value.slice(start, end)
	return rawText(slicedValue, oldStartIndex + start)
}

export function rawText(value: string, offset = 0): TextToken {
	return text(value, [offset, offset + value.length])
}
