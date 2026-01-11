import type { TokenisedLine } from "#commits/Commit.ts"
import type { TokenConfiguration } from "#configurations/Configuration.ts"

export type IssueLinkToken = {
	type: "issue-link"
	value: string
}

export function issueLink(value: string): IssueLinkToken {
	return { type: "issue-link", value }
}

export function tokeniseIssueLinks(
	initialTokens: TokenisedLine,
	configuration: TokenConfiguration,
): TokenisedLine {
	const combinedPrefixPattern = configuration.issueLinkPrefixes
		.map((prefix) => RegExp.escape(prefix))
		.join("|")

	// Assume all issue links to have a numeric key after the string prefix.
	// They can be surrounded by whitespace, enclosed in brackets (bracket pair consistency not enforced for simplicity), or followed by a colon.
	const combinedRegex = new RegExp(
		`(\\s*[([{<]*(?:${combinedPrefixPattern})\\d+[)\\]}>]*:?\\s*)`,
		"giu",
	)

	const result: TokenisedLine = []

	for (const token of initialTokens) {
		if (typeof token === "string") {
			result.push(
				...token.split(combinedRegex).map((part, index) => {
					// `split()` with a regex preserves the string delimiter (i.e. the substrings that match the regex).
					// Every other item in the array is a match.
					const isIssueLink = index % 2 === 1
					return isIssueLink ? issueLink(part) : part
				}),
			)
		} else {
			result.push(token)
		}
	}

	return result
}
