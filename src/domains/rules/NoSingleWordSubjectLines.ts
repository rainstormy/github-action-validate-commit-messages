import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoSingleWordSubjectLinesOptions = EmptyObject

export function noSingleWordSubjectLines(): Rule {
	throw new Error(
		"The `noSingleWordSubjectLines` rule has not been implemented yet",
	) // TODO: To be implemented.
}
