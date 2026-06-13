import type {
	Configuration,
	RuleConfiguration,
	TokenConfiguration,
} from "#configurations/Configuration.ts"
import { issueLinkConfiguration } from "#configurations/IssueLinkTokenConfiguration.ts"

export type ConfigurationTemplate = {
	rules?: Partial<RuleConfiguration>
	tokens?: Partial<TokenConfiguration>
}

export function fakeConfiguration(overrides: ConfigurationTemplate = {}): Configuration {
	return {
		rules: {
			noBlankSubjectLines: {},
			noExcessiveCommitsPerBranch: { maxCommits: 10 },
			noMergeCommits: {},
			noRepeatedSubjectLines: {},
			noRestrictedTrailers: { restrictedKeys: ["Co-authored-by"] },
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
		tokens: fakeTokenConfiguration(overrides.tokens),
	}
}

export function fakeTokenConfiguration(
	overrides: Partial<TokenConfiguration> = {},
): TokenConfiguration {
	return {
		issueLinks: issueLinkConfiguration(["#", "GH-", "GL-"]),
		...overrides,
	}
}
