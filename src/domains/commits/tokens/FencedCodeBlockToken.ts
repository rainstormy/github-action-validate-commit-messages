import type { Token } from "#commits/tokens/Token.ts"

export type FencedCodeBlockToken = {
	type: "fenced-code-block"
	value: string
}

export function fencedCodeBlock(value: string): FencedCodeBlockToken {
	return { type: "fenced-code-block", value }
}

export function isFencedCodeBlock(token: Token): token is FencedCodeBlockToken {
	return typeof token === "object" && token.type === "fenced-code-block"
}
