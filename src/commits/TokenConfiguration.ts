import { uniqueItems } from "#utilities/Arrays.ts"

export type TokenConfiguration = {
	issueLinks: IssueLinkTokenConfiguration | null
}

export type IssueLinkTokenConfiguration = {
	prefixes: Array<string>
	wildcards: Array<string>
}

export function issueLinkTokenConfiguration(
	prefixes: Array<string>,
	wildcards: Array<string> = [],
): IssueLinkTokenConfiguration {
	return {
		prefixes: uniqueItems(prefixes),
		wildcards: uniqueItems(wildcards),
	}
}
