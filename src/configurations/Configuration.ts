import type { TokenConfiguration } from "#commits/TokenConfiguration.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"

export type Configuration = {
	rules: RulesetConfiguration
	tokens: TokenConfiguration
}

/**
 * A record of rule keys to rule-specific options (if the rule is enabled) or null (if the rule is disabled).
 */
export type RulesetConfiguration = {
	[Key in RuleKey]: RuleOptions<Key> | null
}
