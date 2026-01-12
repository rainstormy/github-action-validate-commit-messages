import type { Rule } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export type NoSquashMarkersOptions = EmptyObject

export function noSquashMarkers(): Rule {
	throw new Error("The `noSquashMarkers` rule has not been implemented yet") // TODO: To be implemented.
}
