import { uniqueItems } from "#utilities/Arrays.ts"

export type IssueLinkTokenConfiguration = {
	prefixes: Array<string>
	wildcards: Array<string>
}

export function issueLinkConfiguration(
	prefixes: Array<string>,
	wildcards: Array<string> = [],
): IssueLinkTokenConfiguration {
	return {
		prefixes: uniqueItems(prefixes),
		wildcards: uniqueItems(wildcards),
	}
}
