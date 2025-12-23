export type FencedCodeBlockToken = {
	type: "fenced-code-block"
	value: string
}

export function fencedCodeBlock(value: string): FencedCodeBlockToken {
	return { type: "fenced-code-block", value }
}
