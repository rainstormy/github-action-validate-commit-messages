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
