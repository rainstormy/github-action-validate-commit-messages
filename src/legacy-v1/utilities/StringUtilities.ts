export function count(subject: Array<unknown> | number, singular: string, plural: string): string {
	if (typeof subject === "number") {
		return `${subject} ${pluralise(subject, singular, plural)}`
	}

	return `${subject.length} ${pluralise(subject.length, singular, plural)}`
}

export function pluralise(subject: number, singular: string, plural: string): string {
	return subject === 1 ? singular : plural
}

const positiveIntegerRegex = /^[1-9][0-9]*$/u

export function requirePositiveInteger(value: string): boolean {
	return positiveIntegerRegex.test(value)
}

export function splitByComma(commaSeparatedString: string): Array<string> {
	return commaSeparatedString
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item.length > 0)
}

export function splitBySpace(spaceSeparatedString: string): Array<string> {
	return spaceSeparatedString
		.split(" ")
		.map((item) => item.trim())
		.filter((item) => item.length > 0)
}
