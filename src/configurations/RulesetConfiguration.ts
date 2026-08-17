import * as v from "valibot"
import { naturalNumber } from "#types/NaturalNumber.ts"
import { type DeepPartial, deepMerge } from "#utilities/Objects.ts"

export type RulesetConfiguration = v.InferOutput<typeof RULESET_CONFIGURATION_SCHEMA>

const RULE_LEVEL = v.picklist(["off", "error"])
const EMPTY_RULE_CONFIGURATION = ruleConfiguration({})

export const RULESET_CONFIGURATION_SCHEMA = v.strictObject({
	noBlankSubjectLines: EMPTY_RULE_CONFIGURATION,
	noExcessiveCommitsPerBranch: ruleConfiguration({ maxCommits: naturalNumber() }),
	noExcessiveWhitespace: EMPTY_RULE_CONFIGURATION,
	noMergeCommits: EMPTY_RULE_CONFIGURATION,
	noRepeatedSubjectLines: EMPTY_RULE_CONFIGURATION,
	noRestrictedTrailers: ruleConfiguration({ restrictedKeys: v.array(v.string()) }),
	noRevertRevertCommits: EMPTY_RULE_CONFIGURATION,
	noSingleWordSubjectLines: EMPTY_RULE_CONFIGURATION,
	noSquashMarkers: EMPTY_RULE_CONFIGURATION,
	noUnexpectedPunctuation: EMPTY_RULE_CONFIGURATION,
	useAuthorEmailPatterns: ruleConfiguration({ patterns: v.array(v.string()) }),
	useAuthorNamePatterns: ruleConfiguration({ patterns: v.array(v.string()) }),
	useCapitalisedSubjectLines: EMPTY_RULE_CONFIGURATION,
	useCommitterEmailPatterns: ruleConfiguration({ patterns: v.array(v.string()) }),
	useCommitterNamePatterns: ruleConfiguration({ patterns: v.array(v.string()) }),
	useConciseSubjectLines: ruleConfiguration({ maxLength: naturalNumber() }),
	useEmptyLineBeforeBodyLines: EMPTY_RULE_CONFIGURATION,
	useImperativeSubjectLines: ruleConfiguration({ whitelist: v.array(v.string()) }),
	useIssueLinks: ruleConfiguration({ position: v.picklist(["anywhere", "prefix", "suffix"]) }),
	useLineWrapping: ruleConfiguration({ maxLength: naturalNumber() }),
	useSignedCommits: EMPTY_RULE_CONFIGURATION,
})

// oxlint-disable-next-line typescript/explicit-function-return-type -- Rely on type inference for Valibot schemas.
function ruleConfiguration<Options extends v.ObjectEntries>(options: Options) {
	return v.strictObject({ level: RULE_LEVEL, options: v.strictObject(options) })
}

export type RuleKey = keyof RulesetConfiguration

export function mergeRulesetConfigurations(
	source: RulesetConfiguration,
	overrides: DeepPartial<RulesetConfiguration>,
): RulesetConfiguration {
	return deepMerge(source, overrides)
}
