import type { Token } from "#commits/tokens/Token.ts"

export type HyperlinkToken = {
	type: "hyperlink"
	value: string
}

export function hyperlink(value: string): HyperlinkToken {
	return { type: "hyperlink", value }
}

export function isHyperlink(token: Token): token is HyperlinkToken {
	return typeof token === "object" && token.type === "hyperlink"
}
