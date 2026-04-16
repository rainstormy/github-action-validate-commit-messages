export function indexOfFromBinarySearch(sortedValues: Array<string>, target: string): number {
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

export function countOccurrences(value: string, characterToCount: string): number {
	return value.split(characterToCount).length - 1
}

export function requireAtLeastOneValue(values: Array<string>): boolean {
	return values.length > 0
}

export function requireNoDuplicateValues(values: Array<string>): boolean {
	return new Set(values).size === values.length
}

export function getDuplicateValues(values: Array<string>): Array<string> {
	return [...new Set(values.filter((value, index) => values.lastIndexOf(value) !== index))]
}

export function requireNoUnknownValues<Value extends string>(
	knownValues: ReadonlyArray<Value>,
): (values: Array<string>) => values is Array<Value> {
	return (values: Array<string>): values is Array<Value> =>
		values.every((value) => isKnownValue(value, knownValues))
}

export function getUnknownValues(
	knownValues: ReadonlyArray<string>,
	values: Array<string>,
): Array<string> {
	return [...new Set(values.filter((value) => !isKnownValue(value, knownValues)))]
}

function isKnownValue<Value extends string>(
	value: string,
	knownValues: ReadonlyArray<Value>,
): value is Value {
	return (knownValues as ReadonlyArray<string>).includes(value)
}
