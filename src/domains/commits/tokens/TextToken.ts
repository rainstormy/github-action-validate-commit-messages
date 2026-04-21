export type TextToken = {
	type: "text"
	value: string
}

export function text(value: string): TextToken {
	return { type: "text", value }
}

export function slicedText(token: TextToken, start?: number, end?: number): TextToken {
	return text(token.value.slice(start, end))
}
