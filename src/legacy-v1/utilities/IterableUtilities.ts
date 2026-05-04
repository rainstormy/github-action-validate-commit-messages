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
