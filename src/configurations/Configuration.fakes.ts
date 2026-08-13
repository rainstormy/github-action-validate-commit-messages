import { fakeTokenConfiguration } from "#commits/TokenConfiguration.fakes.ts"
import type { TokenConfiguration } from "#commits/TokenConfiguration.ts"
import type { Configuration, RulesetConfiguration } from "#configurations/Configuration.ts"

export type ConfigurationTemplate = {
	rules?: Partial<RulesetConfiguration>
	tokens?: Partial<TokenConfiguration>
}

export function fakeConfiguration(overrides: ConfigurationTemplate = {}): Configuration {
	return {
		rules: {
			noBlankSubjectLines: {},
			noExcessiveCommitsPerBranch: { maxCommits: 10 },
			noExcessiveWhitespace: {},
			noMergeCommits: {},
			noRepeatedSubjectLines: {},
			noRestrictedTrailers: { restrictedKeys: ["Co-authored-by"] },
			noRevertRevertCommits: {},
			noSingleWordSubjectLines: {},
			noSquashMarkers: {},
			noUnexpectedPunctuation: {},
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
			useLineWrapping: { maxLength: 72 },
			useSignedCommits: {},
			...overrides.rules,
		},
		tokens: fakeTokenConfiguration(overrides.tokens),
	}
}

export function emptyRulesetConfiguration(
	overrides: Partial<RulesetConfiguration> = {},
): RulesetConfiguration {
	return {
		noBlankSubjectLines: null,
		noExcessiveCommitsPerBranch: null,
		noExcessiveWhitespace: null,
		noMergeCommits: null,
		noRepeatedSubjectLines: null,
		noRestrictedTrailers: null,
		noRevertRevertCommits: null,
		noSingleWordSubjectLines: null,
		noSquashMarkers: null,
		noUnexpectedPunctuation: null,
		useAuthorEmailPatterns: null,
		useAuthorNamePatterns: null,
		useCapitalisedSubjectLines: null,
		useCommitterEmailPatterns: null,
		useCommitterNamePatterns: null,
		useConciseSubjectLines: null,
		useEmptyLineBeforeBodyLines: null,
		useImperativeSubjectLines: null,
		useIssueLinks: null,
		useLineWrapping: null,
		useSignedCommits: null,
		...overrides,
	}
}
