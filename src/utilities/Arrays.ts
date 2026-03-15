export function* splitToChunks<Item>(
	items: Array<Item>,
	chunkSize: number,
): Generator<Array<Item>> {
	for (let i = 0; i < items.length; i += chunkSize) {
		yield items.slice(i, i + chunkSize)
	}
}

export function notNullish<Item>(item: Item | null | undefined): item is Item {
	return item !== null && item !== undefined
}

export function notNullishValue<Item>(
	item: [key: string, value: Item | null | undefined],
): item is [key: string, value: Item] {
	const [, value] = item
	return value !== null && value !== undefined
}

export function notEmptyString<Item>(item: Item): boolean {
	return item !== ""
}

export type NonEmptyArray<Item> = [Item, ...Array<Item>]

export function isNonEmptyArray<Item>(items: Array<Item>): items is NonEmptyArray<Item> {
	return items.length > 0
}

export type Comparator<Item> = (a: Item, b: Item) => number

export const ALPHABETICALLY: Comparator<string> = (a, b) => a.localeCompare(b, "en")

export function findMin<Item>(items: NonEmptyArray<Item>, comparator: Comparator<Item>): Item {
	const iterator = items[Symbol.iterator]()
	let minSoFar = iterator.next().value as Item

	for (const item of iterator) {
		if (comparator(item, minSoFar) < 0) {
			minSoFar = item
		}
	}

	return minSoFar
}

export function findMax<Item>(items: NonEmptyArray<Item>, comparator: Comparator<Item>): Item {
	const iterator = items[Symbol.iterator]()
	let maxSoFar = iterator.next().value as Item

	for (const item of iterator) {
		if (comparator(item, maxSoFar) > 0) {
			maxSoFar = item
		}
	}

	return maxSoFar
}
