const positiveIntegerRegex = /^[1-9][0-9]*$/u

export function requirePositiveInteger(value: string): boolean {
	return positiveIntegerRegex.test(value)
}
