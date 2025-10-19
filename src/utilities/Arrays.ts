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
