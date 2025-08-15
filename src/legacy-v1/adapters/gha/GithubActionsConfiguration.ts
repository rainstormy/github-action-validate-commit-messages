import { parse } from "valibot"
import { githubActionsStringInput } from "#legacy-v1/adapters/gha/GithubActionsEnv"
import {
	type Configuration,
	configurationSchema,
} from "#legacy-v1/validator/Configuration"

export function getGithubActionsConfiguration(): Configuration {
	return parse(configurationSchema, {
		ruleKeys: githubActionsStringInput("rules"),
		acknowledgedAuthorEmailAddresses: {
			patterns: githubActionsStringInput(
				"acknowledged-author-email-addresses--patterns",
			),
		},
		acknowledgedAuthorNames: {
			patterns: githubActionsStringInput("acknowledged-author-names--patterns"),
		},
		acknowledgedCommitterEmailAddresses: {
			patterns: githubActionsStringInput(
				"acknowledged-committer-email-addresses--patterns",
			),
		},
		acknowledgedCommitterNames: {
			patterns: githubActionsStringInput(
				"acknowledged-committer-names--patterns",
			),
		},
		imperativeSubjectLines: {
			whitelist: githubActionsStringInput(
				"imperative-subject-lines--whitelist",
			),
		},
		issueReferencesInSubjectLines: {
			allowedPositions: githubActionsStringInput(
				"issue-references-in-subject-lines--allowed-positions",
			),
			patterns: githubActionsStringInput(
				"issue-references-in-subject-lines--patterns",
			),
		},
		limitLengthOfBodyLines: {
			maximumCharacters: githubActionsStringInput(
				"limit-length-of-body-lines--max-characters",
			),
		},
		limitLengthOfSubjectLines: {
			maximumCharacters: githubActionsStringInput(
				"limit-length-of-subject-lines--max-characters",
			),
		},
		noSquashCommits: {
			disallowedPrefixes: githubActionsStringInput(
				"no-squash-commits--disallowed-prefixes",
			),
		},
		noTrailingPunctuationInSubjectLines: {
			whitelist: githubActionsStringInput(
				"no-trailing-punctuation-in-subject-lines--whitelist",
			),
		},
	})
}
