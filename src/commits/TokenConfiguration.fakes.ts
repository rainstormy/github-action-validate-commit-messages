import {
	type TokenConfiguration,
	issueLinkTokenConfiguration,
} from "#commits/TokenConfiguration.ts"

export function fakeTokenConfiguration(
	overrides: Partial<TokenConfiguration> = {},
): TokenConfiguration {
	return {
		issueLinks: issueLinkTokenConfiguration(["#", "GH-", "GL-"]),
		...overrides,
	}
}
