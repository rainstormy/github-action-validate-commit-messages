import * as v from "valibot"

export type NarrowToAction<Target> = v.TransformAction<InferInput<Target>, Target>

// oxfmt-ignore
type InferInput<Target> =
	| Target extends boolean ? boolean
	: Target extends number ? number
	: Target extends string ? string
	: never

export function narrowTo<Target>(): NarrowToAction<Target> {
	return v.transform((value) => value as Target)
}
