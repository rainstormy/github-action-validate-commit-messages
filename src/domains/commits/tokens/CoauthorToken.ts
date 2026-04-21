import type { CharacterRange } from "#types/CharacterRange.ts"

export type CoauthorToken = {
	type: "coauthor"
	value: string
	range: CharacterRange
}

export function coauthor(value: string, range: CharacterRange): CoauthorToken {
	return { type: "coauthor", value, range }
}
