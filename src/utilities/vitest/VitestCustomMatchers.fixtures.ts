import type { MatcherResult, MatcherState } from "vitest"
import { type TokenType, isNotToken, isToken } from "#commits/tokens/Token.ts"
import type { NonEmptyArray } from "#utilities/Arrays.ts"

export function toContainToken(
	this: MatcherState,
	received: unknown,
	...desiredTypes: NonEmptyArray<TokenType>
): MatcherResult {
	const pass = Array.isArray(received) && received.flat().some(isToken(...desiredTypes))

	const withoutDesiredTokens =
		this.isNot && Array.isArray(received)
			? received.flat().filter(isNotToken(...desiredTypes))
			: null

	return {
		pass,
		message: () => {
			const formattedTypes = desiredTypes.map((type) => `'${type}'`).join(" or ")
			return `expected tokens ${this.isNot ? "not " : ""}to contain ${formattedTypes}`
		},
		actual: received,
		expected: withoutDesiredTokens,
	}
}
