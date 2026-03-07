import type { CoauthorToken } from "#commits/tokens/CoauthorToken.ts"
import type { DependencyVersionToken } from "#commits/tokens/DependencyVersionToken.ts"
import type { FencedCodeBlockToken } from "#commits/tokens/FencedCodeBlockToken.ts"
import type { HyperlinkToken } from "#commits/tokens/HyperlinkToken.ts"
import type { IssueLinkToken } from "#commits/tokens/IssueLinkToken.ts"
import type { SquashMarkerToken } from "#commits/tokens/SquashMarkerToken.ts"
import type { TokenConfiguration } from "#configurations/Configuration.ts"

export type Token =
	| string
	| CoauthorToken
	| DependencyVersionToken
	| FencedCodeBlockToken
	| HyperlinkToken
	| IssueLinkToken
	| SquashMarkerToken

export type TokenisedLine = Array<Token>
export type TokenisedLines = Array<TokenisedLine>

export type Tokeniser = (
	initialTokens: TokenisedLine,
	configuration: TokenConfiguration,
) => TokenisedLine

export type Tokenisers = Array<Tokeniser>
