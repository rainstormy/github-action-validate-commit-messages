import * as v from "valibot"
import { RULESET_CONFIGURATION_SCHEMA } from "#configurations/RulesetConfiguration.ts"

export type JsonConfigurationDto = v.InferOutput<typeof JSON_CONFIGURATION_DTO>

const TOKENS_DTO = v.strictObject({
	issueLinks: v.exactOptional(
		v.strictObject({
			prefixes: v.exactOptional(v.array(v.string())),
			wildcards: v.exactOptional(v.array(v.string())),
		}),
	),
})

export const JSON_CONFIGURATION_DTO = v.strictObject({
	$schema: v.exactOptional(v.string()),
	extends: v.exactOptional(v.string()),
	rules: v.exactOptional(RULESET_CONFIGURATION_SCHEMA),
	tokens: v.exactOptional(TOKENS_DTO),
})
