import type { CharacterRange } from "#types/CharacterRange.ts"

export type Token = {
	type: TokenType
	value: string
	range: CharacterRange
}

export type TokenType = UniversalTokenType | SubjectLineTokenType | BodyLineTokenType

export type UniversalTokenType = "inline-code" | "punctuation" | "whitespace" | "word"

export type SubjectLineTokenType =
	| "dependency-version"
	| "issue-link"
	| "revert-marker"
	| "squash-marker"

export type BodyLineTokenType = "fenced-code-block" | "hyperlink" | "trailer-key" | "trailer-value"

export type TokenisedLine = Array<Token>
export type TokenisedLines = Array<TokenisedLine>

export function tokenOf(type: TokenType, value: string, rangeStart = 0): Token {
	return {
		type,
		value,
		range: [rangeStart, rangeStart + value.length],
	}
}

export function formatTokenisedLine(tokens: TokenisedLine): string {
	return tokens.map((token) => token.value).join("")
}

export function tokenisePlainText(value: string, rangeStart = 0): TokenisedLine {
	return [...value.matchAll(plainTextRegex)].map((match) => {
		const tokenValue = match[0]
		const tokenRangeStart = rangeStart + match.index

		return tokenValue.trim() === ""
			? tokenOf("whitespace", tokenValue, tokenRangeStart)
			: wordRegex.test(tokenValue)
				? tokenOf("word", tokenValue, tokenRangeStart)
				: tokenOf("punctuation", tokenValue, tokenRangeStart)
	})
}

export function tokeniseStructuredText(
	type: TokenType,
	value: string,
	rangeStart = 0,
): TokenisedLine {
	return [...value.matchAll(structuredTextRegex)].map((match) => {
		const tokenValue = match[0]
		const tokenRangeStart = rangeStart + match.index

		return tokenValue.trim() === ""
			? tokenOf("whitespace", tokenValue, tokenRangeStart)
			: tokenOf(type, tokenValue, tokenRangeStart)
	})
}

export function isPlainToken(token: Token): boolean {
	return token.type === "punctuation" || token.type === "whitespace" || token.type === "word"
}

export function splitPlainTokens(
	tokens: TokenisedLine,
	regex: RegExp,
	onMatch: (value: string, rangeStart: number) => Token | TokenisedLine,
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

const plainTextRegex = /\s+|[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]+/gu
const structuredTextRegex = /\s+|\S+/gu
const wordRegex = /^[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*$/u

function splitPlainTokenSpan(
	tokens: TokenisedLine,
	regex: RegExp,
	onMatch: (value: string, rangeStart: number) => Token | TokenisedLine,
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
				...toTokenisedLine(onMatch(matchValue, spanStartIndex + matchStartIndex)),
			)
			previousEndIndex = matchStartIndex + matchValue.length
		}
	}

	return [
		...result,
		...tokenisePlainText(spanValue.slice(previousEndIndex), spanStartIndex + previousEndIndex),
	]
}

function toTokenisedLine(tokenOrTokens: Token | TokenisedLine): TokenisedLine {
	return Array.isArray(tokenOrTokens) ? tokenOrTokens : [tokenOrTokens]
}
