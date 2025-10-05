export function assertNotNullish<Value>(
	value: Value | null | undefined,
	errorMessage?: () => string,
): asserts value is Value {
	if (value === null || value === undefined) {
		throw new Error(
			errorMessage?.() ?? `Expected a not-nullish value, but got ${value}`,
		)
	}
}

export function assertNonBlankString(
	value: unknown,
	errorMessage?: () => string,
): asserts value is string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new Error(
			errorMessage?.() ?? `Expected a non-blank string, but got ${value}`,
		)
	}
}

export function assertError(error: unknown): asserts error is Error {
	if (!(error instanceof Error)) {
		throw error
	}
}
