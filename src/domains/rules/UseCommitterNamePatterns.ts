import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type UseCommitterNamePatternsOptions = EmptyObject

export function useCommitterNamePatterns(): Rule {
	throw new Error(
		"The `useCommitterNamePatterns` rule has not been implemented yet",
	) // TODO: To be implemented.
}
