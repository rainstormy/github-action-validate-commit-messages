import { type TokenisedLine, splitTextTokens } from "#commits/tokens/Token.ts"
import type { TokenConfiguration } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export type IssueLinkToken = {
	type: "issue-link"
	value: string
	range: CharacterRange
}

export function issueLink(value: string, range: CharacterRange): IssueLinkToken {
	return { type: "issue-link", value, range }
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

	return splitTextTokens(initialTokens, combinedRegex, issueLink)
}
