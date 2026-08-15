import type { RuleKey, RuleOptions } from "#rules/Rule.ts"

export function getDefaultRuleOptions(): {
	[Key in RuleKey]: RuleOptions<Key>
} {
	return {
		noBlankSubjectLines: {},
		noExcessiveCommitsPerBranch: { maxCommits: 10 },
		noExcessiveWhitespace: {},
		noMergeCommits: {},
		noRepeatedSubjectLines: {},
		noRestrictedTrailers: { restrictedKeys: [] },
		noRevertRevertCommits: {},
		noSingleWordSubjectLines: {},
		noSquashMarkers: {},
		noUnexpectedPunctuation: {},
		useAuthorEmailPatterns: { patterns: [] },
		useAuthorNamePatterns: { patterns: [] },
		useCapitalisedSubjectLines: {},
		useCommitterEmailPatterns: { patterns: [] },
		useCommitterNamePatterns: { patterns: [] },
		useConciseSubjectLines: { maxLength: 50 },
		useEmptyLineBeforeBodyLines: {},
		useImperativeSubjectLines: { whitelist: [] },
		useIssueLinks: { position: "anywhere" },
		useLineWrapping: { maxLength: 72 },
		useSignedCommits: {},
	}
}
