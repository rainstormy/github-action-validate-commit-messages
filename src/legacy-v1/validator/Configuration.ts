import { type InferInput, type InferOutput, object } from "valibot"
import { acknowledgedAuthorEmailAddressesConfigurationSchema } from "#legacy-v1/rules/AcknowledgedAuthorEmailAddresses/AcknowledgedAuthorEmailAddressesConfiguration"
import { acknowledgedAuthorNamesConfigurationSchema } from "#legacy-v1/rules/AcknowledgedAuthorNames/AcknowledgedAuthorNamesConfiguration"
import { acknowledgedCommitterEmailAddressesConfigurationSchema } from "#legacy-v1/rules/AcknowledgedCommitterEmailAddresses/AcknowledgedCommitterEmailAddressesConfiguration"
import { acknowledgedCommitterNamesConfigurationSchema } from "#legacy-v1/rules/AcknowledgedCommitterNames/AcknowledgedCommitterNamesConfiguration"
import { imperativeSubjectLinesConfigurationSchema } from "#legacy-v1/rules/ImperativeSubjectLines/ImperativeSubjectLinesConfiguration"
import { issueReferencesInSubjectLinesConfigurationSchema } from "#legacy-v1/rules/IssueReferencesInSubjectLines/IssueReferencesInSubjectLinesConfiguration"
import { limitLengthOfBodyLinesConfigurationSchema } from "#legacy-v1/rules/LimitLengthOfBodyLines/LimitLengthOfBodyLinesConfiguration"
import { limitLengthOfSubjectLinesConfigurationSchema } from "#legacy-v1/rules/LimitLengthOfSubjectLines/LimitLengthOfSubjectLinesConfiguration"
import { noSquashCommitsConfigurationSchema } from "#legacy-v1/rules/NoSquashCommits/NoSquashCommitsConfiguration"
import { noTrailingPunctuationInSubjectLinesConfigurationSchema } from "#legacy-v1/rules/NoTrailingPunctuationInSubjectLines/NoTrailingPunctuationInSubjectLinesConfiguration"
import { ruleKeysConfigurationSchema } from "#legacy-v1/rules/RulesConfiguration"

export const configurationSchema = object({
	ruleKeys: ruleKeysConfigurationSchema,
	acknowledgedAuthorEmailAddresses:
		acknowledgedAuthorEmailAddressesConfigurationSchema,
	acknowledgedAuthorNames: acknowledgedAuthorNamesConfigurationSchema,
	acknowledgedCommitterEmailAddresses:
		acknowledgedCommitterEmailAddressesConfigurationSchema,
	acknowledgedCommitterNames: acknowledgedCommitterNamesConfigurationSchema,
	imperativeSubjectLines: imperativeSubjectLinesConfigurationSchema,
	issueReferencesInSubjectLines:
		issueReferencesInSubjectLinesConfigurationSchema,
	limitLengthOfBodyLines: limitLengthOfBodyLinesConfigurationSchema,
	limitLengthOfSubjectLines: limitLengthOfSubjectLinesConfigurationSchema,
	noSquashCommits: noSquashCommitsConfigurationSchema,
	noTrailingPunctuationInSubjectLines:
		noTrailingPunctuationInSubjectLinesConfigurationSchema,
})

export type RawConfiguration = InferInput<typeof configurationSchema>
export type Configuration = InferOutput<typeof configurationSchema>
