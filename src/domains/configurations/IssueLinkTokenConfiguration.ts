import { uniqueItems } from "#utilities/Arrays.ts"
import { regexEnum, regexUnion } from "#utilities/Regexes.ts"

export type IssueLinkTokenConfiguration = {
	prefixes: Array<string>
	wildcards: Array<string>
	regex: RegExp
}

export function issueLinkConfiguration(
	prefixes: Array<string>,
	wildcards: Array<string> = [],
): IssueLinkTokenConfiguration {
	const uniquePrefixes = uniqueItems(prefixes)
	const uniqueWildcards = uniqueItems(wildcards)

	const anyPrefix = regexEnum(uniquePrefixes)
	const anyWildcard = regexEnum(uniqueWildcards)

	// Assume all issue links to have a numeric key after the string prefix.
	// They can be surrounded by whitespace, enclosed in brackets (bracket pair consistency not enforced for simplicity), or followed by a colon.
	// language=jsregexp
	const anyNumericIssueLink = anyPrefix ? String.raw`[([{<]*(?:${anyPrefix})\d+[)\]}>]*:?` : ""

	return {
		prefixes: uniquePrefixes,
		wildcards: uniqueWildcards,
		regex: new RegExp(
			// language=jsregexp
			String.raw`(\s*(?:${regexUnion([anyNumericIssueLink, anyWildcard])})\s*)`,
			"gu",
		),
	}
}
