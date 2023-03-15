import type { Configuration } from "+validator"

export const dummyDefaultConfiguration: Configuration = {
	ruleKeys: [
		"capitalised-subject-lines",
		"no-merge-commits",
		"no-squash-commits",
		"no-trailing-punctuation-in-subject-lines",
	],
	issueReferencesInSubjectLines: {
		patterns: ["^\\b$"], // A regular expression that never matches anything.
		allowedPositions: ["as-prefix", "as-suffix"],
	},
	noSquashCommits: {
		disallowedPrefixes: ["amend!", "fixup!", "squash!"],
	},
	noTrailingPunctuationInSubjectLines: {
		customWhitelist: [],
	},
}

const githubStyleIssueReference = "#[1-9][0-9]*"
const jiraStyleIssueReference = "UNICORN-[1-9][0-9]*"

export const dummyGithubStyleIssueReferencesAsPrefixConfiguration: Configuration =
	{
		...dummyDefaultConfiguration,
		ruleKeys: [
			...dummyDefaultConfiguration.ruleKeys,
			"issue-references-in-subject-lines",
		],
		issueReferencesInSubjectLines: {
			allowedPositions: ["as-prefix"],
			patterns: [
				`\\(${githubStyleIssueReference}\\)`,
				`${githubStyleIssueReference}:`,
				githubStyleIssueReference,
			],
		},
	}

export const dummyGithubStyleIssueReferencesAsSuffixConfiguration: Configuration =
	{
		...dummyDefaultConfiguration,
		ruleKeys: [
			...dummyDefaultConfiguration.ruleKeys,
			"issue-references-in-subject-lines",
		],
		issueReferencesInSubjectLines: {
			allowedPositions: ["as-suffix"],
			patterns: [
				`\\(${githubStyleIssueReference}\\)`,
				githubStyleIssueReference,
			],
		},
	}

export const dummyJiraStyleIssueReferencesConfiguration: Configuration = {
	...dummyDefaultConfiguration,
	ruleKeys: [
		...dummyDefaultConfiguration.ruleKeys,
		"issue-references-in-subject-lines",
	],
	issueReferencesInSubjectLines: {
		...dummyDefaultConfiguration.issueReferencesInSubjectLines,
		patterns: [
			`\\(${jiraStyleIssueReference}\\)`,
			`${jiraStyleIssueReference}:`,
			jiraStyleIssueReference,
		],
	},
}
