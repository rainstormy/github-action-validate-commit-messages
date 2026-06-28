import {
	type TokenisedLine,
	splitPlainTokens,
	tokeniseStructuredText,
} from "#commits/tokens/Token.ts"
import type { TokenConfiguration } from "#configurations/Configuration.ts"

export function issueLink(value: string, rangeStart = 0): TokenisedLine {
	return tokeniseStructuredText("issue-link", value, rangeStart)
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
