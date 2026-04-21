import type { CoauthorToken } from "#commits/tokens/CoauthorToken.ts"
import type { DependencyVersionToken } from "#commits/tokens/DependencyVersionToken.ts"
import type { FencedCodeBlockToken } from "#commits/tokens/FencedCodeBlockToken.ts"
import type { HyperlinkToken } from "#commits/tokens/HyperlinkToken.ts"
import type { InlineCodeToken } from "#commits/tokens/InlineCodeToken.ts"
import type { IssueLinkToken } from "#commits/tokens/IssueLinkToken.ts"
import type { RevertMarkerToken } from "#commits/tokens/RevertMarkerToken.ts"
import type { SquashMarkerToken } from "#commits/tokens/SquashMarkerToken.ts"
import { type TextToken, text } from "#commits/tokens/TextToken.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

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

export function splitTextTokens(
	tokens: TokenisedLine,
	regex: RegExp,
	onMatch: (value: string, range: CharacterRange) => Token,
): TokenisedLine {
	const result: TokenisedLine = []

	for (const token of tokens) {
		if (token.type === "text") {
			const parts = token.value.split(regex)
			let startIndex = token.range[0]

			for (const [partIndex, partValue] of parts.entries()) {
				const endIndex = startIndex + partValue.length
				const range: CharacterRange = [startIndex, endIndex]

				// `split()` with a regex preserves the string delimiter (i.e. the substrings that match the regex).
				// Every other item in the array is a match.
				result.push(partIndex % 2 === 1 ? onMatch(partValue, range) : text(partValue, range))
				startIndex = endIndex
			}
		} else {
			result.push(token)
		}
	}

	return result
}
