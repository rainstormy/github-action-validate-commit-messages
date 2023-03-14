import { ruleKeys } from "+rules"
import type { Configuration } from "+validator"

export const dummyDefaultConfiguration: Configuration = {
	ruleKeys,
	noSquashCommits: {
		disallowedPrefixes: ["amend!", "fixup!", "squash!"],
	},
	noTrailingPunctuationInSubjectLines: {
		customWhitelist: [],
	},
}
