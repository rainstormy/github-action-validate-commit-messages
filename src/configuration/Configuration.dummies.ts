import type { Configuration } from "+configuration"
import { ruleKeys } from "+rules"

export const dummyConfiguration: Configuration = {
	ruleKeys,
	noSquashCommits: {
		disallowedPrefixes: ["amend!", "fixup!", "squash!"],
	},
	noTrailingPunctuationInSubjectLines: {
		customWhitelist: [],
	},
}
