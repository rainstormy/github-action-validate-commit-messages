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
