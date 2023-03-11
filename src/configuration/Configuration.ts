import {
	noSquashCommitsConfigurationSchema,
	noTrailingPunctuationInSubjectLinesConfigurationSchema,
	ruleKeysConfigurationSchema,
} from "+configuration"
import { z } from "zod"

const configurationSchema = z.object({
	ruleKeys: ruleKeysConfigurationSchema,
	noSquashCommits: noSquashCommitsConfigurationSchema,
	noTrailingPunctuationInSubjectLines:
		noTrailingPunctuationInSubjectLinesConfigurationSchema,
})

export type Configuration = z.output<typeof configurationSchema>

export function parseConfiguration(
	rawConfiguration: z.input<typeof configurationSchema>,
): ReturnType<typeof configurationSchema.safeParse> {
	return configurationSchema.safeParse(rawConfiguration)
}
