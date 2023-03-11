import { parseConfiguration } from "+configuration"
import core from "@actions/core"

export function configurationFromInputs(): ReturnType<
	typeof parseConfiguration
> {
	return parseConfiguration({
		ruleKeys: core.getInput("rules"),
		noSquashCommits: {
			disallowedPrefixes: core.getInput(
				"no-squash-commits--disallowed-prefixes",
			),
		},
		noTrailingPunctuationInSubjectLines: {
			customWhitelist: core.getInput(
				"no-trailing-punctuation-in-subject-lines--whitelist",
			),
		},
	})
}
