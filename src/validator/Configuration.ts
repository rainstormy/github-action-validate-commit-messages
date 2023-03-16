import {
	imperativeSubjectLinesConfigurationSchema,
	issueReferencesInSubjectLinesConfigurationSchema,
	noSquashCommitsConfigurationSchema,
	noTrailingPunctuationInSubjectLinesConfigurationSchema,
	ruleKeysConfigurationSchema,
} from "+rules"
import { z } from "zod"

const configurationSchema = z.object({
	ruleKeys: ruleKeysConfigurationSchema,
	imperativeSubjectLines: imperativeSubjectLinesConfigurationSchema,
	issueReferencesInSubjectLines:
		issueReferencesInSubjectLinesConfigurationSchema,
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
