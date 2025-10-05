import { type TransformAction, transform } from "valibot"

export type NarrowToAction<Destination> = TransformAction<
	ToPrimitive<Destination>,
	Destination
>

// biome-ignore format: It's easier to read linearly.
type ToPrimitive<Destination> =
	| Destination extends boolean ? boolean
	: Destination extends number ? number
	: Destination extends string ? string
	: never

export function narrowTo<Destination>(): NarrowToAction<Destination> {
	return transform((value) => value as Destination)
}
