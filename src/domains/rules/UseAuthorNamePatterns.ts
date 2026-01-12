import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type UseAuthorNamePatternsOptions = EmptyObject

export function useAuthorNamePatterns(): Rule {
	throw new Error(
		"The `useAuthorNamePatterns` rule has not been implemented yet",
	) // TODO: To be implemented.
}
