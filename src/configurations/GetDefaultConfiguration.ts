import type { Configuration } from "#configurations/Configuration"

export function getDefaultConfiguration(): Configuration {
	switch (import.meta.env.VITE_TARGET_PLATFORM) {
		case "cli": {
			return getDefaultCliConfiguration()
		}
		case "gha": {
			return getDefaultGhaConfiguration()
		}
	}
}

function getDefaultCliConfiguration() {
	return {
		noCoAuthors: {},
		noMergeCommits: {},
		noRepeatedSubjectLines: null,
		noRevertRevertCommits: null,
		noSingleWordSubjectLines: {},
		noSquashPrefixes: null,
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
		useIssueReferences: null,
		useLineWrapping: {},
	}
}

function getDefaultGhaConfiguration() {
	return {
		noCoAuthors: {},
		noMergeCommits: {},
		noRepeatedSubjectLines: {},
		noRevertRevertCommits: {},
		noSingleWordSubjectLines: {},
		noSquashPrefixes: {},
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
		useIssueReferences: null,
		useLineWrapping: {},
	}
}
