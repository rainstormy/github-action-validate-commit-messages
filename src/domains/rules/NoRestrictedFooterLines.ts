import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoRestrictedFooterLinesOptions = EmptyObject

export function noRestrictedFooterLines(): Rule {
	throw new Error(
		"The `noRestrictedFooterLines` rule has not been implemented yet",
	) // TODO: To be implemented.
}
