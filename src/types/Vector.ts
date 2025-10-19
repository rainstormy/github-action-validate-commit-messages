export function vectorOf<Item, Count extends number>(
	count: Count,
	itemFactory: (index: number) => Item,
): Vector<Item, Count> {
	return Array.from({ length: count }, (_ignored, index) =>
		itemFactory(index),
	) as Vector<Item, Count>
}

export type Vector<Item, Count extends number> = Count extends Count
	? number extends Count
		? Array<Item>
		: AppendItemToTuple<Item, Count, []>
	: never

type AppendItemToTuple<
	Item,
	Count extends number,
	Accumulator extends Array<unknown>,
> = Accumulator["length"] extends Count
	? Accumulator
	: AppendItemToTuple<Item, Count, [Item, ...Accumulator]>
