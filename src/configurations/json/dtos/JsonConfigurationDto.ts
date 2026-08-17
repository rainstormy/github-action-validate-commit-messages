import * as v from "valibot"
import {
	RULESET_CONFIGURATION_SCHEMA,
	RULE_LEVEL_SCHEMA,
} from "#configurations/RulesetConfiguration.ts"

export type JsonConfigurationDto = v.InferOutput<typeof JSON_CONFIGURATION_DTO>

const TOKENS_DTO = v.strictObject({
	issueLinks: v.exactOptional(
		v.strictObject({
			prefixes: v.exactOptional(v.array(v.string())),
			wildcards: v.exactOptional(v.array(v.string())),
		}),
	),
})

// Allow JSON configuration files to provide an `error` or `off` string literal directly, omitting the object of `level` and `options`.
// The rule falls back to its default options in this case.
const RULES_DTO = v.strictObject(
	Object.fromEntries(
		Object.entries(RULESET_CONFIGURATION_SCHEMA.entries).map(
			([ruleKey, ruleConfigurationSchema]) => [
				ruleKey,
				v.exactOptional(v.union([RULE_LEVEL_SCHEMA, ruleConfigurationSchema])),
			],
		),
	),
)

export const JSON_CONFIGURATION_DTO = v.strictObject({
	$schema: v.exactOptional(v.string()),
	extends: v.exactOptional(v.string()),
	rules: v.exactOptional(RULES_DTO),
	tokens: v.exactOptional(TOKENS_DTO),
})
