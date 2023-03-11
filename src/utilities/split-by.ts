export function splitByComma(
	commaSeparatedString: string,
): ReadonlyArray<string> {
	return commaSeparatedString
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item.length > 0)
}

export function splitBySpace(
	spaceSeparatedString: string,
): ReadonlyArray<string> {
	return spaceSeparatedString
		.split(" ")
		.map((item) => item.trim())
		.filter((item) => item.length > 0)
}
