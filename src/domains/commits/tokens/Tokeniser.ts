import { tokeniseDependencyVersions } from "#commits/tokens/DependencyVersionToken.ts"
import { tokeniseInlineCodePhrases } from "#commits/tokens/InlineCodeToken.ts"
import { tokeniseIssueLinks } from "#commits/tokens/IssueLinkToken.ts"
import { tokeniseRevertMarkers } from "#commits/tokens/RevertMarkerToken.ts"
import { tokeniseSquashMarkers } from "#commits/tokens/SquashMarkerToken.ts"
import { type Token, type TokenisedLine, tokenisePlainText } from "#commits/tokens/Token.ts"
import type { TokenConfiguration } from "#configurations/Configuration.ts"

export function tokeniser(configuration: TokenConfiguration): (value: string) => TokenisedLine {
	return (value: string): TokenisedLine =>
		tokeniseDependencyVersions(
			tokeniseIssueLinks(
				tokeniseInlineCodePhrases(
					tokeniseRevertMarkers(tokeniseSquashMarkers(tokenisePlainText(value))),
				),
				configuration,
			),
		).filter(notEmptyToken)
}

function notEmptyToken(createToken: Token): boolean {
	return createToken.value !== ""
}
