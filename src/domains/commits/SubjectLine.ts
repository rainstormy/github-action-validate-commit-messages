export type SubjectLine = Array<SubjectLineToken>

export type SubjectLineToken =
	| string
	| SubjectLineDependencyVersionToken
	| SubjectLineIssueReferenceToken
	| SubjectLineSquashMarkerToken

export type SubjectLineDependencyVersionToken = {
	type: "dependency-version"
	value: string
}

export type SubjectLineIssueReferenceToken = {
	type: "issue-reference"
	value: string
}

export type SubjectLineSquashMarkerToken = {
	type: "squash-marker"
	value: string
}
