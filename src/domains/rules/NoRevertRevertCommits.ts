import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoRevertRevertCommitsOptions = EmptyObject

export function noRevertRevertCommits(): Rule {
	throw new Error(
		"The `noRevertRevertCommits` rule has not been implemented yet",
	) // TODO: To be implemented.
}
