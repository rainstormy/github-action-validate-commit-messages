import type { IssueLinkTokenConfiguration } from "#configurations/IssueLinkTokenConfiguration.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"

export type Configuration = {
	rules: RuleConfiguration
	tokens: TokenConfiguration
}

/**
 * A record of rule keys to rule-specific options (if the rule is enabled) or null (if the rule is disabled).
 */
export type RuleConfiguration = {
	[Key in RuleKey]: RuleOptions<Key> | null
}

export type TokenConfiguration = {
	issueLinks: IssueLinkTokenConfiguration | null
}
