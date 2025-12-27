export type IssueLinkToken = {
	type: "issue-link"
	value: string
}

export function issueLink(value: string): IssueLinkToken {
	return { type: "issue-link", value }
}
