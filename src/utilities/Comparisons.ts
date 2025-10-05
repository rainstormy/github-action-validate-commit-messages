export function deepEquals<Value>(a: Value, b: Value): boolean {
	if (a === b) {
		return true
	}
	if (
		typeof a !== "object" ||
		typeof b !== "object" ||
		a === null ||
		b === null
	) {
		return false
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		return a.length === b.length && a.every((item, i) => deepEquals(item, b[i]))
	}

	const keys = Object.keys(a) as Array<keyof Value>
	return (
		keys.length === Object.keys(b).length &&
		keys.every((key) => deepEquals(a[key], b[key]))
	)
}
