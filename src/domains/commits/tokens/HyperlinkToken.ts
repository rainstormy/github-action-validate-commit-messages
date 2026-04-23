import type { CharacterRange } from "#types/CharacterRange.ts"

export type HyperlinkToken = {
	type: "hyperlink"
	value: string
	range: CharacterRange
}

export function hyperlink(value: string, range: CharacterRange): HyperlinkToken {
	return { type: "hyperlink", value, range }
}
