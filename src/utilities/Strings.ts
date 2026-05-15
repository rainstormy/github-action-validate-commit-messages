/**
 * Replaces each block of one of more whitespace characters with a single regular space character.
 * Hence, it collapses multiple spaces to a single space, and it replaces newlines with spaces.
 */
export function collapseWhitespace(value: string): string {
	return value.replaceAll(/\s+/g, " ")
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

export function indentString(value: string, offset: number): string {
	return prefixStringLines(value, " ".repeat(offset))
}

export function prefixStringLines(value: string, prefix: string): string {
	return prefix + value.replaceAll("\n", `\n${prefix}`)
}
