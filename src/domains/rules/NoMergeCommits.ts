import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoMergeCommitsOptions = EmptyObject

export function noMergeCommits(): Rule {
	throw new Error("The `noMergeCommits` rule has not been implemented yet") // TODO: To be implemented.
}
