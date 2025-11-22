export type BodyLine = Array<BodyLineToken>
export type BodyLines = Array<BodyLine>

export type BodyLineToken =
	| string
	| BodyLineCoAuthorToken
	| BodyLineFencedCodeBlockToken
	| BodyLineUrlToken

export type BodyLineCoAuthorToken = {
	type: "co-author"
	value: string
}

export type BodyLineFencedCodeBlockToken = {
	type: "fenced-code-block"
	value: string
}

export type BodyLineUrlToken = {
	type: "url"
	value: string
}
