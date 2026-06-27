import type { DependencyVersionToken } from "#commits/tokens/DependencyVersionToken.ts"
import type { FencedCodeBlockToken } from "#commits/tokens/FencedCodeBlockToken.ts"
import type { HyperlinkToken } from "#commits/tokens/HyperlinkToken.ts"
import type { InlineCodeToken } from "#commits/tokens/InlineCodeToken.ts"
import type { IssueLinkToken } from "#commits/tokens/IssueLinkToken.ts"
import { type PunctuationToken, punctuation } from "#commits/tokens/PunctuationToken.ts"
import type { RevertMarkerToken } from "#commits/tokens/RevertMarkerToken.ts"
import type { SquashMarkerToken } from "#commits/tokens/SquashMarkerToken.ts"
import type { TrailerToken } from "#commits/tokens/TrailerToken.ts"
import { type WhitespaceToken, whitespace } from "#commits/tokens/WhitespaceToken.ts"
import { type WordToken, word } from "#commits/tokens/WordToken.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export type Token =
	| DependencyVersionToken
	| FencedCodeBlockToken
	| HyperlinkToken
	| InlineCodeToken
	| IssueLinkToken
	| PunctuationToken
	| RevertMarkerToken
	| SquashMarkerToken
	| TrailerToken
	| WhitespaceToken
	| WordToken

export type TokenisedLine = Array<Token>
export type TokenisedLines = Array<TokenisedLine>

export function formatTokenisedLine(tokens: TokenisedLine): string {
	return tokens.map(formatToken).join("")
}

export function tokenisePlainText(value: string, rangeStart = 0): TokenisedLine {
	return [...value.matchAll(plainTextRegex)].map((match) => {
		const tokenValue = match[0]
		const tokenRangeStart = rangeStart + match.index

		return tokenValue.trim() === ""
			? whitespace(tokenValue, tokenRangeStart)
			: wordRegex.test(tokenValue)
				? word(tokenValue, tokenRangeStart)
				: punctuation(tokenValue, tokenRangeStart)
	})
}

export function isPlainToken(token: Token): token is PlainToken {
	return token.type === "punctuation" || token.type === "whitespace" || token.type === "word"
}

function formatToken(token: Token): string {
	return token.type === "trailer" ? `${token.key}${token.value}` : token.value
}

export function splitPlainTokens(
	tokens: TokenisedLine,
	regex: RegExp,
	onMatch: (value: string, rangeStart: number) => Token,
): TokenisedLine {
	const result: TokenisedLine = []
	let plainTokens: TokenisedLine = []

	function flushPlainTokens(): void {
		if (plainTokens.length === 0) {
			return
		}

		result.push(...splitPlainTokenSpan(plainTokens, regex, onMatch))
		plainTokens = []
	}

	for (const token of tokens) {
		if (isPlainToken(token)) {
			plainTokens.push(token)
		} else {
			flushPlainTokens()
			result.push(token)
		}
	}

	flushPlainTokens()
	return result
}

export function trimmedTokenRange(token: Token): CharacterRange {
	const [start, end] = token.range
	const leadingOffset = token.value.length - token.value.trimStart().length
	const trailingOffset = token.value.length - token.value.trimEnd().length
	return [start + leadingOffset, end - trailingOffset]
}

type PlainToken = PunctuationToken | WhitespaceToken | WordToken

const plainTextRegex = /\s+|[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]+/gu
const wordRegex = /^[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*$/u

function splitPlainTokenSpan(
	tokens: TokenisedLine,
	regex: RegExp,
	onMatch: (value: string, rangeStart: number) => Token,
): TokenisedLine {
	const [firstToken] = tokens

	if (firstToken === undefined) {
		return []
	}

	const spanStartIndex = firstToken.range[0]
	const spanValue = formatTokenisedLine(tokens)
	const result: TokenisedLine = []
	let previousEndIndex = 0

	for (const match of spanValue.matchAll(regex)) {
		const matchValue = match[0]
		const matchStartIndex = match.index

		if (matchValue !== "") {
			result.push(
				...tokenisePlainText(
					spanValue.slice(previousEndIndex, matchStartIndex),
					spanStartIndex + previousEndIndex,
				),
				onMatch(matchValue, spanStartIndex + matchStartIndex),
			)
			previousEndIndex = matchStartIndex + matchValue.length
		}
	}

	return [
		...result,
		...tokenisePlainText(spanValue.slice(previousEndIndex), spanStartIndex + previousEndIndex),
	]
}
