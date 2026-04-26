import type {
	Configuration,
	RuleConfiguration,
	TokenConfiguration,
} from "#configurations/Configuration.ts"
import { getDefaultTokenConfiguration } from "#configurations/GetDefaultConfiguration.ts"

export type ConfigurationTemplate = {
	tokens?: Partial<TokenConfiguration>
	rules?: Partial<RuleConfiguration>
}

export function fakeConfiguration(overrides: ConfigurationTemplate = {}): Configuration {
	return {
		tokens: {
			...getDefaultTokenConfiguration(),
			...overrides.tokens,
		},
		rules: {
			noBlankSubjectLines: {},
			noExcessiveCommitsPerBranch: {},
			noMergeCommits: {},
			noRepeatedSubjectLines: {},
			noRestrictedFooterLines: {},
			noRevertRevertCommits: {},
			noSingleWordSubjectLines: {},
			noSquashMarkers: {},
			noUnexpectedPunctuation: {},
			noUnexpectedWhitespace: {},
			useAuthorEmailPatterns: {},
			useAuthorNamePatterns: {},
			useCapitalisedSubjectLines: {},
			useCommitterEmailPatterns: {},
			useCommitterNamePatterns: {},
			useConciseSubjectLines: { maxLength: 50 },
			useEmptyLineBeforeBodyLines: {},
			useImperativeSubjectLines: {},
			useIssueLinks: {},
			useLineWrapping: {},
			useSignedCommits: {},
			...overrides.rules,
		},
	}
}
