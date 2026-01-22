import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type UseSignedCommitsOptions = EmptyObject

export function useSignedCommits(): Rule {
	throw new Error("The `useSignedCommits` rule has not been implemented yet") // TODO: To be implemented.
}
