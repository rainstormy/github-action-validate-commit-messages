import type {
	Configuration,
	TokenConfiguration,
} from "#configurations/Configuration.ts"
import type { CometPlatform } from "#utilities/platform/CometPlatform.ts"

export function getDefaultConfiguration(): Configuration {
	const platform: CometPlatform = import.meta.env.COMET_PLATFORM

	switch (platform) {
		case "cli": {
			return getDefaultCliConfiguration()
		}
		case "gha": {
			return getDefaultGhaConfiguration()
		}
		default: {
			throw new Error("Environment variable 'COMET_PLATFORM' is undefined")
		}
	}
}

function getDefaultCliConfiguration(): Configuration {
	return {
		tokens: getDefaultTokenConfiguration(),
		rules: {
			noExcessiveCommitsPerBranch: {},
			noMergeCommits: {},
			noRepeatedSubjectLines: null,
			noRestrictedFooterLines: {},
			noRevertRevertCommits: null,
			noSingleWordSubjectLines: {},
			noSquashMarkers: null,
			noUnexpectedPunctuation: {},
			noUnexpectedWhitespace: {},
			useAuthorEmailPatterns: null,
			useAuthorNamePatterns: null,
			useCapitalisedSubjectLines: {},
			useCommitterEmailPatterns: null,
			useCommitterNamePatterns: null,
			useConciseSubjectLines: {},
			useEmptyLineBeforeBodyLines: {},
			useImperativeSubjectLines: {},
			useIssueLinks: null,
			useLineWrapping: {},
			useSignedCommits: {},
		},
	}
}

function getDefaultGhaConfiguration(): Configuration {
	return {
		tokens: getDefaultTokenConfiguration(),
		rules: {
			noExcessiveCommitsPerBranch: {},
			noMergeCommits: {},
			noRepeatedSubjectLines: {},
			noRestrictedFooterLines: {},
			noRevertRevertCommits: {},
			noSingleWordSubjectLines: {},
			noSquashMarkers: {},
			noUnexpectedPunctuation: {},
			noUnexpectedWhitespace: {},
			useAuthorEmailPatterns: null,
			useAuthorNamePatterns: null,
			useCapitalisedSubjectLines: {},
			useCommitterEmailPatterns: null,
			useCommitterNamePatterns: null,
			useConciseSubjectLines: {},
			useEmptyLineBeforeBodyLines: {},
			useImperativeSubjectLines: {},
			useIssueLinks: null,
			useLineWrapping: {},
			useSignedCommits: {},
		},
	}
}

function getDefaultTokenConfiguration(): TokenConfiguration {
	return {
		issueLinkPrefixes: ["#", "GH-", "GL-"],
	}
}
