import type { Configuration } from "#configurations/Configuration.ts"
import { issueLinkConfiguration } from "#configurations/IssueLinkTokenConfiguration.ts"

export function getDefaultGithubActionsConfiguration(): Configuration {
	return {
		tokens: {
			issueLinks: issueLinkConfiguration(["#", "GH-", "GL-"]),
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
