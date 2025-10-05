export type HttpUrlString = `https://${string}`

export function requireHttpUrlString(
	value: unknown,
	errorMessage?: (invalidValue: unknown) => string,
): HttpUrlString {
	assertHttpUrlString(value, errorMessage)
	return value
}

export function assertHttpUrlString(
	value: unknown,
	errorMessage: (invalidValue: unknown) => string = (invalidValue: unknown) =>
		`Expected a non-blank URL string, but got ${invalidValue}`,
): asserts value is HttpUrlString {
	if (
		typeof value !== "string" ||
		!value.startsWith("https://") ||
		value.length <= "https://".length
	) {
		throw new Error(errorMessage(value))
	}
}
