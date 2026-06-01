export type IssueLinkTokenConfiguration = {
	prefixes: Array<string>
	regex: RegExp
}

export function issueLinkConfiguration(prefixes: Array<string>): IssueLinkTokenConfiguration {
	const uniquePrefixes = [...new Set(prefixes)]
	const combinedPrefixPattern = uniquePrefixes.map((prefix) => RegExp.escape(prefix)).join("|")

	// Assume all issue links to have a numeric key after the string prefix.
	// They can be surrounded by whitespace, enclosed in brackets (bracket pair consistency not enforced for simplicity), or followed by a colon.
	const combinedRegex = new RegExp(
		// language=jsregexp
		String.raw`(\s*[([{<]*(?:${combinedPrefixPattern})\d+[)\]}>]*:?\s*)`,
		"giu",
	)

	return { prefixes: uniquePrefixes, regex: combinedRegex }
}
