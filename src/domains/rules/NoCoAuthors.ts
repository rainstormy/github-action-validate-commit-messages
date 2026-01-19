import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoCoAuthorsOptions = EmptyObject

export function noCoAuthors(): Rule {
	throw new Error("The `noCoAuthors` rule has not been implemented yet") // TODO: To be implemented.
}
