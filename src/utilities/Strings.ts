export function indentString(value: string, offset: number): string {
	const indent = " ".repeat(offset)
	return indent + value.replaceAll("\n", `\n${indent}`)
}

export function countOccurrences(
	value: string,
	search: string,
	options?: { caseInsensitive?: boolean },
): number {
	const caseInsensitive = options?.caseInsensitive ?? false

	const regex = new RegExp(RegExp.escape(search), caseInsensitive ? "giu" : "gu")
	return value.match(regex)?.length ?? 0
}

export function formatCount(count: number, singular: string, plural: string): string {
	return `${count} ${count === 1 ? singular : plural}`
}
