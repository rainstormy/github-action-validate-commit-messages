export type IssueReferenceToken = {
	type: "issue-reference"
	value: string
}

export function issueReference(value: string): IssueReferenceToken {
	return { type: "issue-reference", value }
}
