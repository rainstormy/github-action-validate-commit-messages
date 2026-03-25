import type { Token } from "#commits/tokens/Token.ts"

export type CoauthorToken = {
	type: "coauthor"
	value: string
}

export function coauthor(value: string): CoauthorToken {
	return { type: "coauthor", value }
}

export function isCoauthor(token: Token): token is CoauthorToken {
	return typeof token === "object" && token.type === "coauthor"
}
