export function capitalise(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1)
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
