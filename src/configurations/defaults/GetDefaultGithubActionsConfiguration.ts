import { issueLinkTokenConfiguration } from "#commits/TokenConfiguration.ts"
import type { Configuration } from "#configurations/Configuration.ts"
import { getDefaultRuleOptions } from "#configurations/defaults/GetDefaultRuleOptions.ts"

export function getDefaultGithubActionsConfiguration(): Configuration {
	return {
		tokens: {
			issueLinks: issueLinkTokenConfiguration(["#", "GH-", "GL-"]),
		},
		rules: {
			...getDefaultRuleOptions(),
			noRestrictedTrailers: null,
			useAuthorEmailPatterns: null,
			useAuthorNamePatterns: null,
			useCommitterEmailPatterns: null,
			useCommitterNamePatterns: null,
			useIssueLinks: null,
		},
	}
}
