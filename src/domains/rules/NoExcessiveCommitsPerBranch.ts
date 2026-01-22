import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoExcessiveCommitsPerBranchOptions = EmptyObject

export function noExcessiveCommitsPerBranch(): Rule {
	throw new Error(
		"The `noExcessiveCommitsPerBranch` rule has not been implemented yet",
	) // TODO: To be implemented.
}
