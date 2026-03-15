import { type TransformAction, transform } from "valibot"

export type NarrowToAction<Target> = TransformAction<InferInput<Target>, Target>

// oxfmt-ignore
type InferInput<Target> =
	| Target extends boolean ? boolean
	: Target extends number ? number
	: Target extends string ? string
	: never

export function narrowTo<Target>(): NarrowToAction<Target> {
	return transform((value) => value as Target)
}
