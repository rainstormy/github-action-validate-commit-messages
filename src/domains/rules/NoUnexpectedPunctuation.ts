import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoUnexpectedPunctuationOptions = EmptyObject

export function noUnexpectedPunctuation(): Rule {
	throw new Error(
		"The `noUnexpectedPunctuation` rule has not been implemented yet",
	) // TODO: To be implemented.
}
