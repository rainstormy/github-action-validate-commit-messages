import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type UseAuthorEmailPatternsOptions = EmptyObject

export function useAuthorEmailPatterns(): Rule {
	throw new Error(
		"The `useAuthorEmailPatterns` rule has not been implemented yet",
	) // TODO: To be implemented.
}
