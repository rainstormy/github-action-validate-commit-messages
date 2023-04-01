export function requireNoUnknownValues<Value extends string>(
	knownValues: ReadonlyArray<Value>,
): (values: ReadonlyArray<string>) => values is ReadonlyArray<Value> {
	return (values): values is ReadonlyArray<Value> =>
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
