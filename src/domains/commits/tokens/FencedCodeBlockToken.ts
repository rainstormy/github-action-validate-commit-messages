import type { CharacterRange } from "#types/CharacterRange.ts"

export type FencedCodeBlockToken = {
	type: "fenced-code-block"
	value: string
	range: CharacterRange
}

export function fencedCodeBlock(value: string, range: CharacterRange): FencedCodeBlockToken {
	return { type: "fenced-code-block", value, range }
}
