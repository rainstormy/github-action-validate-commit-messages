export function indentString(value: string, offset: number): string {
	const indent = " ".repeat(offset)
	return indent + value.replaceAll(/\n/g, `\n${indent}`)
}
