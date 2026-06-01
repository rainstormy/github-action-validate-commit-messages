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
			noExcessiveCommitsPerBranch: { maxCommits: 10 },
			noMergeCommits: {},
			noRepeatedSubjectLines: {},
			noRestrictedFooterLines: {},
			noRevertRevertCommits: {},
			noSingleWordSubjectLines: {},
			noSquashMarkers: {},
			noUnexpectedPunctuation: {},
			noUnexpectedWhitespace: {},
			useAuthorEmailPatterns: {
				patterns: [String.raw`\d+\+.+@users\.noreply\.github\.com`],
			},
			useAuthorNamePatterns: {
				patterns: [
					String.raw`\p{Lu}.*\s.+`,
					String.raw`dependabot\[bot\]`,
					String.raw`renovate\[bot\]`,
				],
			},
			useCapitalisedSubjectLines: {},
			useCommitterEmailPatterns: {
				patterns: [
					String.raw`\d+\+.+@users\.noreply\.github\.com`,
					String.raw`noreply@github\.com`,
				],
			},
			useCommitterNamePatterns: {
				patterns: [
					String.raw`\p{Lu}.*\s.+`,
					String.raw`dependabot\[bot\]`,
					String.raw`renovate\[bot\]`,
					String.raw`GitHub`,
				],
			},
			useConciseSubjectLines: { maxLength: 50 },
			useEmptyLineBeforeBodyLines: {},
			useImperativeSubjectLines: { whitelist: [] },
			useIssueLinks: { position: "anywhere" },
			useLineWrapping: {},
			useSignedCommits: {},
			...overrides.rules,
		},
	}
}
