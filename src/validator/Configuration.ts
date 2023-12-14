import { acknowledgedAuthorEmailAddressesConfigurationSchema } from "+rules/AcknowledgedAuthorEmailAddresses/AcknowledgedAuthorEmailAddressesConfiguration"
import { acknowledgedAuthorNamesConfigurationSchema } from "+rules/AcknowledgedAuthorNames/AcknowledgedAuthorNamesConfiguration"
import { acknowledgedCommitterEmailAddressesConfigurationSchema } from "+rules/AcknowledgedCommitterEmailAddresses/AcknowledgedCommitterEmailAddressesConfiguration"
import { acknowledgedCommitterNamesConfigurationSchema } from "+rules/AcknowledgedCommitterNames/AcknowledgedCommitterNamesConfiguration"
import { imperativeSubjectLinesConfigurationSchema } from "+rules/ImperativeSubjectLines/ImperativeSubjectLinesConfiguration"
import { issueReferencesInSubjectLinesConfigurationSchema } from "+rules/IssueReferencesInSubjectLines/IssueReferencesInSubjectLinesConfiguration"
import { limitLengthOfBodyLinesConfigurationSchema } from "+rules/LimitLengthOfBodyLines/LimitLengthOfBodyLinesConfiguration"
import { limitLengthOfSubjectLinesConfigurationSchema } from "+rules/LimitLengthOfSubjectLines/LimitLengthOfSubjectLinesConfiguration"
import { noSquashCommitsConfigurationSchema } from "+rules/NoSquashCommits/NoSquashCommitsConfiguration"
import { noTrailingPunctuationInSubjectLinesConfigurationSchema } from "+rules/NoTrailingPunctuationInSubjectLines/NoTrailingPunctuationInSubjectLinesConfiguration"
import { ruleKeysConfigurationSchema } from "+rules/RulesConfiguration"
import { z } from "zod"

const configurationSchema = z.object({
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

export type RawConfiguration = z.input<typeof configurationSchema>
export type Configuration = z.output<typeof configurationSchema>

export function parseConfiguration(
	rawConfiguration: RawConfiguration,
): ReturnType<typeof configurationSchema.safeParse> {
	return configurationSchema.safeParse(rawConfiguration)
}
