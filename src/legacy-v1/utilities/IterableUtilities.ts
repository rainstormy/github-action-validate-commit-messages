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
		const comparison = target.localeCompare(
			sortedValues[middleIndex] ?? "",
			"en",
		)

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

export function countOccurrences(
	value: string,
	characterToCount: string,
): number {
	return value.split(characterToCount).length - 1
}

export function requireAtLeastOneValue(values: ReadonlyArray<string>): boolean {
	return values.length > 0
}

export function requireNoDuplicateValues(
	values: ReadonlyArray<string>,
): boolean {
	return new Set(values).size === values.length
}

export function getDuplicateValues(
	values: ReadonlyArray<string>,
): ReadonlyArray<string> {
	return [
		...new Set(
			values.filter((value, index) => values.lastIndexOf(value) !== index),
		),
	]
}

export function requireNoUnknownValues<Value extends string>(
	knownValues: ReadonlyArray<Value>,
): (values: ReadonlyArray<string>) => values is ReadonlyArray<Value> {
	return (values: ReadonlyArray<string>): values is ReadonlyArray<Value> =>
		values.every((value) => isKnownValue(value, knownValues))
}

export function getUnknownValues<Value extends string>(
	knownValues: ReadonlyArray<Value>,
	values: ReadonlyArray<string>,
): ReadonlyArray<string> {
	return [
		...new Set(values.filter((value) => !isKnownValue(value, knownValues))),
	]
}

function isKnownValue<Value extends string>(
	value: string,
	knownValues: ReadonlyArray<Value>,
): value is Value {
	return (knownValues as ReadonlyArray<string>).includes(value)
}
