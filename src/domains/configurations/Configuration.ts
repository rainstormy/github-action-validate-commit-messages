import type { RuleKey, RuleOptions } from "#rules/Rule.ts"

export type Configuration = {
	tokens: TokenConfiguration
	rules: RuleConfiguration
}

/**
 * A record of rule keys to rule-specific options (if the rule is enabled) or null (if the rule is disabled).
 */
export type RuleConfiguration = {
	[Key in RuleKey]: RuleOptions<Key>
}

export type TokenConfiguration = {
	issueLinkPrefixes: Array<string>
}
