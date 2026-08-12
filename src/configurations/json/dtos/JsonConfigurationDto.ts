import * as v from "valibot"
import { NO_EXCESSIVE_COMMITS_PER_BRANCH_OPTIONS } from "#rules/NoExcessiveCommitsPerBranch.ts"
import { NO_RESTRICTED_TRAILERS_OPTIONS } from "#rules/NoRestrictedTrailers.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { USE_AUTHOR_EMAIL_PATTERNS_OPTIONS } from "#rules/UseAuthorEmailPatterns.ts"
import { USE_AUTHOR_NAME_PATTERNS_OPTIONS } from "#rules/UseAuthorNamePatterns.ts"
import { USE_COMMITTER_EMAIL_PATTERNS_OPTIONS } from "#rules/UseCommitterEmailPatterns.ts"
import { USE_COMMITTER_NAME_PATTERNS_OPTIONS } from "#rules/UseCommitterNamePatterns.ts"
import { USE_CONCISE_SUBJECT_LINES_OPTIONS } from "#rules/UseConciseSubjectLines.ts"
import { USE_IMPERATIVE_SUBJECT_LINES_OPTIONS } from "#rules/UseImperativeSubjectLines.ts"
import { USE_ISSUE_LINKS_OPTIONS } from "#rules/UseIssueLinks.ts"
import { USE_LINE_WRAPPING_OPTIONS } from "#rules/UseLineWrapping.ts"

export type JsonConfigurationDto = v.InferOutput<typeof JSON_CONFIGURATION_DTO>

const NO_RULE_OPTIONS = v.strictObject({})
const RULE_LEVEL = v.picklist(["off", "error"])

const RULES_DTO = v.strictObject({
	noBlankSubjectLines: ruleDto(NO_RULE_OPTIONS),
	noExcessiveCommitsPerBranch: ruleDto(NO_EXCESSIVE_COMMITS_PER_BRANCH_OPTIONS),
	noExcessiveWhitespace: ruleDto(NO_RULE_OPTIONS),
	noMergeCommits: ruleDto(NO_RULE_OPTIONS),
	noRepeatedSubjectLines: ruleDto(NO_RULE_OPTIONS),
	noRestrictedTrailers: ruleDto(NO_RESTRICTED_TRAILERS_OPTIONS),
	noRevertRevertCommits: ruleDto(NO_RULE_OPTIONS),
	noSingleWordSubjectLines: ruleDto(NO_RULE_OPTIONS),
	noSquashMarkers: ruleDto(NO_RULE_OPTIONS),
	noUnexpectedPunctuation: ruleDto(NO_RULE_OPTIONS),
	useAuthorEmailPatterns: ruleDto(USE_AUTHOR_EMAIL_PATTERNS_OPTIONS),
	useAuthorNamePatterns: ruleDto(USE_AUTHOR_NAME_PATTERNS_OPTIONS),
	useCapitalisedSubjectLines: ruleDto(NO_RULE_OPTIONS),
	useCommitterEmailPatterns: ruleDto(USE_COMMITTER_EMAIL_PATTERNS_OPTIONS),
	useCommitterNamePatterns: ruleDto(USE_COMMITTER_NAME_PATTERNS_OPTIONS),
	useConciseSubjectLines: ruleDto(USE_CONCISE_SUBJECT_LINES_OPTIONS),
	useEmptyLineBeforeBodyLines: ruleDto(NO_RULE_OPTIONS),
	useImperativeSubjectLines: ruleDto(USE_IMPERATIVE_SUBJECT_LINES_OPTIONS),
	useIssueLinks: ruleDto(USE_ISSUE_LINKS_OPTIONS),
	useLineWrapping: ruleDto(USE_LINE_WRAPPING_OPTIONS),
	useSignedCommits: ruleDto(NO_RULE_OPTIONS),
} satisfies Record<RuleKey, ReturnType<typeof ruleDto>>)

// oxlint-disable-next-line typescript/explicit-function-return-type -- Rely on type inference for Valibot schemas.
function ruleDto<Options extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
	options: Options,
) {
	return v.exactOptional(v.union([RULE_LEVEL, v.strictObject({ level: RULE_LEVEL, options })]))
}

const TOKENS_DTO = v.strictObject({
	issueLinks: v.exactOptional(
		v.strictObject({
			prefixes: v.exactOptional(v.array(v.string())),
			wildcards: v.exactOptional(v.array(v.string())),
		}),
	),
})

const OVERRIDE_SCOPE = v.picklist(["cli", "github-actions"])

const OVERRIDE_DTO = v.strictObject({
	scope: v.union([OVERRIDE_SCOPE, v.array(OVERRIDE_SCOPE)]),
	rules: v.exactOptional(RULES_DTO),
	tokens: v.exactOptional(TOKENS_DTO),
})

export const JSON_CONFIGURATION_DTO = v.strictObject({
	$schema: v.exactOptional(v.string()),
	rules: v.exactOptional(RULES_DTO),
	tokens: v.exactOptional(TOKENS_DTO),
	overrides: v.exactOptional(v.array(OVERRIDE_DTO)),
})
