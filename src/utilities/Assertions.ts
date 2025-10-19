export function requireNotNullish<Value extends NonNullable<unknown>>(
	value: Value | null | undefined,
	errorMessage?: (invalidValue: null | undefined) => string,
): Value {
	assertNotNullish(value, errorMessage)
	return value
}

export function assertNotNullish<Value extends NonNullable<unknown>>(
	value: Value | null | undefined,
	errorMessage: (invalidValue: null | undefined) => string = (
		invalidValue: null | undefined,
	) => `Expected a not-nullish value, but got ${invalidValue}`,
): asserts value is Value {
	if (value === null || value === undefined) {
		throw new Error(errorMessage(value))
	}
}

export function requireNotBlankString(
	value: unknown,
	errorMessage?: (invalidValue: unknown) => string,
): string {
	assertNotBlankString(value, errorMessage)
	return value
}

export function assertNotBlankString(
	value: unknown,
	errorMessage: (invalidValue: unknown) => string = (invalidValue: unknown) =>
		`Expected a non-blank string, but got ${invalidValue}`,
): asserts value is string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new Error(errorMessage(value))
	}
}

export function assertError(error: unknown): asserts error is Error {
	if (!(error instanceof Error)) {
		throw error
	}
}
