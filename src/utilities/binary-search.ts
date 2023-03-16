export function indexOfFromBinarySearch(
	sortedValues: ReadonlyArray<string>,
	target: string,
): number {
	function binarySearch(
		inclusiveStartIndex: number,
		inclusiveEndIndex: number,
	): number {
		const middleIndex = Math.floor(
			(inclusiveStartIndex + inclusiveEndIndex) / 2,
		)
		const comparison = target.localeCompare(sortedValues[middleIndex], "en")

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
