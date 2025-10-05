export type HttpUrlString = `https://${string}`

export function assertHttpUrlString(
	value: unknown,
	errorMessage?: () => string,
): asserts value is HttpUrlString {
	if (
		typeof value !== "string" ||
		!value.startsWith("https://") ||
		value.length <= "https://".length
	) {
		throw new Error(
			errorMessage?.() ?? `Expected a non-blank URL string, but got ${value}`,
		)
	}
}
