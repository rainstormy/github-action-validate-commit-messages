import {
	acknowledgedAuthorEmailAddressesConfigurationSchema,
	acknowledgedAuthorNamesConfigurationSchema,
	acknowledgedCommitterEmailAddressesConfigurationSchema,
	acknowledgedCommitterNamesConfigurationSchema,
	imperativeSubjectLinesConfigurationSchema,
	issueReferencesInSubjectLinesConfigurationSchema,
	limitLengthOfBodyLinesConfigurationSchema,
	limitLengthOfSubjectLinesConfigurationSchema,
	noSquashCommitsConfigurationSchema,
	noTrailingPunctuationInSubjectLinesConfigurationSchema,
	ruleKeysConfigurationSchema,
} from "+rules"
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
