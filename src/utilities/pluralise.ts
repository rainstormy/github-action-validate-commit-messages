export function count(
	subject: ReadonlyArray<unknown> | number,
	singular: string,
	plural: string,
): string {
	if (typeof subject === "number") {
		return `${subject} ${pluralise(subject, singular, plural)}`
	}

	return `${subject.length} ${pluralise(subject.length, singular, plural)}`
}

export function pluralise(
	subject: number,
	singular: string,
	plural: string,
): string {
	return subject === 1 ? singular : plural
}
