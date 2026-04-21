import type { CoauthorToken } from "#commits/tokens/CoauthorToken.ts"
import type { DependencyVersionToken } from "#commits/tokens/DependencyVersionToken.ts"
import type { FencedCodeBlockToken } from "#commits/tokens/FencedCodeBlockToken.ts"
import type { HyperlinkToken } from "#commits/tokens/HyperlinkToken.ts"
import type { InlineCodeToken } from "#commits/tokens/InlineCodeToken.ts"
import type { IssueLinkToken } from "#commits/tokens/IssueLinkToken.ts"
import type { RevertMarkerToken } from "#commits/tokens/RevertMarkerToken.ts"
import type { SquashMarkerToken } from "#commits/tokens/SquashMarkerToken.ts"
import type { TextToken } from "#commits/tokens/TextToken.ts"

export type Token =
	| CoauthorToken
	| DependencyVersionToken
	| FencedCodeBlockToken
	| HyperlinkToken
	| InlineCodeToken
	| IssueLinkToken
	| RevertMarkerToken
	| SquashMarkerToken
	| TextToken

export type TokenisedLine = Array<Token>
export type TokenisedLines = Array<TokenisedLine>

export function formatTokenisedLine(tokens: TokenisedLine): string {
	return tokens.map((token) => token.value).join("")
}
