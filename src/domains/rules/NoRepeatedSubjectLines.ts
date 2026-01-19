import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoRepeatedSubjectLinesOptions = EmptyObject

export function noRepeatedSubjectLines(): Rule {
	throw new Error(
		"The `noRepeatedSubjectLines` rule has not been implemented yet",
	) // TODO: To be implemented.
}
