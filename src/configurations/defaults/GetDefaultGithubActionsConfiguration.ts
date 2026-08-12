import { issueLinkTokenConfiguration } from "#commits/TokenConfiguration.ts"
import type { Configuration } from "#configurations/Configuration.ts"

export function getDefaultGithubActionsConfiguration(): Configuration {
	return {
		tokens: {
			issueLinks: issueLinkTokenConfiguration(["#", "GH-", "GL-"]),
		},
		rules: {
			noBlankSubjectLines: {},
			noExcessiveCommitsPerBranch: { maxCommits: 10 },
			noExcessiveWhitespace: {},
			noMergeCommits: {},
			noRepeatedSubjectLines: {},
			noRestrictedTrailers: null,
			noRevertRevertCommits: {},
			noSingleWordSubjectLines: {},
			noSquashMarkers: {},
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
