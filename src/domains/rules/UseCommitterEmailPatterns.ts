import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type UseCommitterEmailPatternsOptions = EmptyObject

export function useCommitterEmailPatterns(): Rule {
	throw new Error(
		"The `useCommitterEmailPatterns` rule has not been implemented yet",
	) // TODO: To be implemented.
}
