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

export function notEmptyString(item: unknown): boolean {
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

export function binarySearchIndexOf(sortedValues: Array<string>, target: string): number {
	function binarySearch(inclusiveStartIndex: number, inclusiveEndIndex: number): number {
		const middleIndex = Math.floor((inclusiveStartIndex + inclusiveEndIndex) / 2)
		const comparison = target.localeCompare(sortedValues[middleIndex] ?? "", "en")

		if (comparison === 0) {
			return middleIndex
		}
		if (inclusiveStartIndex >= inclusiveEndIndex) {
			return -1
		}
		return comparison < 0
			? binarySearch(inclusiveStartIndex, middleIndex - 1)
			: binarySearch(middleIndex + 1, inclusiveEndIndex)
	}

	return binarySearch(0, sortedValues.length - 1)
}

export function uniqueItems<Item>(items: Array<Item>): Array<Item> {
	return [...new Set(items)]
}

export function uniqueItemsByKey<Item>(
	items: Array<Item>,
	keySelector: (item: Item) => string,
): Array<Item> {
	const previousKeys = new Set<string>()

	return items.filter((item) => {
		const key = keySelector(item)
		if (previousKeys.has(key)) {
			return false
		}
		previousKeys.add(key)
		return true
	})
}
