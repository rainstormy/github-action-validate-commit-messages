import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoUnexpectedWhitespaceOptions = EmptyObject

export function noUnexpectedWhitespace(): Rule {
	throw new Error(
		"The `noUnexpectedWhitespace` rule has not been implemented yet",
	) // TODO: To be implemented.
}
