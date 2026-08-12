import { issueLinkTokenConfiguration } from "#commits/TokenConfiguration.ts"
import type { Configuration } from "#configurations/Configuration.ts"

export function getDefaultCommandLineConfiguration(): Configuration {
	return {
		tokens: {
			issueLinks: issueLinkTokenConfiguration(["#", "GH-", "GL-"]),
		},
		rules: {
			noBlankSubjectLines: {},
			noExcessiveCommitsPerBranch: { maxCommits: 10 },
			noExcessiveWhitespace: {},
			noMergeCommits: {},
			noRepeatedSubjectLines: null,
			noRestrictedTrailers: null,
			noRevertRevertCommits: null,
			noSingleWordSubjectLines: {},
			noSquashMarkers: null,
			noUnexpectedPunctuation: {},
			useAuthorEmailPatterns: null,
			useAuthorNamePatterns: null,
			useCapitalisedSubjectLines: {},
			useCommitterEmailPatterns: null,
			useCommitterNamePatterns: null,
			useConciseSubjectLines: { maxLength: 50 },
			useEmptyLineBeforeBodyLines: {},
			useImperativeSubjectLines: { whitelist: [] },
			useIssueLinks: null,
			useLineWrapping: { maxLength: 72 },
			useSignedCommits: {},
		},
	}
}
