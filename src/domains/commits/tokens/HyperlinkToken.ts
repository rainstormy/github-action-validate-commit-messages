export type HyperlinkToken = {
	type: "hyperlink"
	value: string
}

export function hyperlink(value: string): HyperlinkToken {
	return { type: "hyperlink", value }
}
