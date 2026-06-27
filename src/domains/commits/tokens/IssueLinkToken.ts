import { type TokenisedLine, splitPlainTokens } from "#commits/tokens/Token.ts"
import type { TokenConfiguration } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export type IssueLinkToken = {
	type: "issue-link"
	value: string
	range: CharacterRange
}

export function issueLink(value: string, rangeStart = 0): IssueLinkToken {
	return {
		type: "issue-link",
		value,
		range: [rangeStart, rangeStart + value.length],
	}
}

export function tokeniseIssueLinks(
	initialTokens: TokenisedLine,
	configuration: TokenConfiguration,
): TokenisedLine {
	if (configuration.issueLinks === null) {
		return initialTokens
	}

	return splitPlainTokens(initialTokens, configuration.issueLinks.regex, issueLink)
}
