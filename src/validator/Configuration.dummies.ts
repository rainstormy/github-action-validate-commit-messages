import type { Configuration } from "#validator/Configuration"

export const dummyDefaultConfiguration: Configuration = {
	ruleKeys: [
		"capitalised-subject-lines",
		"empty-line-after-subject-lines",
		"imperative-subject-lines",
		"limit-length-of-body-lines",
		"limit-length-of-subject-lines",
		"multi-word-subject-lines",
		"no-co-authors",
		"no-merge-commits",
		"no-revert-revert-commits",
		"no-squash-commits",
		"no-trailing-punctuation-in-subject-lines",
		"no-unexpected-whitespace",
		"unique-subject-lines",
	],
	acknowledgedAuthorEmailAddresses: {
		patterns: ["^\\b$"], // A regular expression that never matches anything.
	},
	acknowledgedAuthorNames: {
		patterns: ["^\\b$"], // A regular expression that never matches anything.
	},
	acknowledgedCommitterEmailAddresses: {
		patterns: ["^\\b$"], // A regular expression that never matches anything.
	},
	acknowledgedCommitterNames: {
		patterns: ["^\\b$"], // A regular expression that never matches anything.
	},
	imperativeSubjectLines: {
		whitelist: [],
	},
	issueReferencesInSubjectLines: {
		patterns: ["^\\b$"], // A regular expression that never matches anything.
		allowedPositions: ["as-prefix", "as-suffix"],
	},
	limitLengthOfBodyLines: {
		maximumCharacters: 72,
	},
	limitLengthOfSubjectLines: {
		maximumCharacters: 50,
	},
	noSquashCommits: {
		disallowedPrefixes: ["amend!", "fixup!", "squash!"],
	},
	noTrailingPunctuationInSubjectLines: {
		whitelist: [],
	},
}

const noreplyGithubEmailAddresses = "\\d+\\+.+@users\\.noreply\\.github\\.com"
const fictiveCompanyEmailAddresses = ".+@fictivecompany\\.com"
const legendaryCompanyEmailAddresses = ".+@thelegendary\\.com"
const twoWordNames = ".+\\s.+"
const threeLetterNames = "\\w{3}"
const fourLetterNames = "\\w{4}"

export const dummyNoreplyGithubOrFictiveCompanyEmailAddressesAndTwoWordOrThreeLetterNamesConfiguration: Configuration =
	{
		...dummyDefaultConfiguration,
		ruleKeys: [
			...dummyDefaultConfiguration.ruleKeys,
			"acknowledged-author-email-addresses",
			"acknowledged-author-names",
			"acknowledged-committer-email-addresses",
			"acknowledged-committer-names",
		],
		acknowledgedAuthorEmailAddresses: {
			patterns: [noreplyGithubEmailAddresses, fictiveCompanyEmailAddresses],
		},
		acknowledgedAuthorNames: {
			patterns: [twoWordNames, threeLetterNames],
		},
		acknowledgedCommitterEmailAddresses: {
			patterns: [noreplyGithubEmailAddresses, fictiveCompanyEmailAddresses],
		},
		acknowledgedCommitterNames: {
			patterns: [twoWordNames, threeLetterNames],
		},
	}

export const dummyLegendaryCompanyEmailAddressesAndFourLetterNamesConfiguration: Configuration =
	{
		...dummyDefaultConfiguration,
		ruleKeys: [
			...dummyDefaultConfiguration.ruleKeys,
			"acknowledged-author-email-addresses",
			"acknowledged-author-names",
			"acknowledged-committer-email-addresses",
			"acknowledged-committer-names",
		],
		acknowledgedAuthorEmailAddresses: {
			patterns: [legendaryCompanyEmailAddresses],
		},
		acknowledgedAuthorNames: {
			patterns: [fourLetterNames],
		},
		acknowledgedCommitterEmailAddresses: {
			patterns: [legendaryCompanyEmailAddresses],
		},
		acknowledgedCommitterNames: {
			patterns: [fourLetterNames],
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
		patterns: [`\\(${jiraStyleIssueReference}\\)`, jiraStyleIssueReference],
	},
}
