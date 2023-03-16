import { parseConfiguration } from "+validator"
import core from "@actions/core"
import type { ZodIssue } from "zod"

export function configurationFromInputs(): ReturnType<
	typeof parseConfiguration
> {
	return parseConfiguration({
		ruleKeys: core.getInput("rules"),
		imperativeSubjectLines: {
			whitelist: core.getInput("imperative-subject-lines--whitelist"),
		},
		issueReferencesInSubjectLines: {
			allowedPositions: core.getInput(
				"issue-references-in-subject-lines--allowed-positions",
			),
			patterns: core.getInput("issue-references-in-subject-lines--patterns"),
		},
		noSquashCommits: {
			disallowedPrefixes: core.getInput(
				"no-squash-commits--disallowed-prefixes",
			),
		},
		noTrailingPunctuationInSubjectLines: {
			whitelist: core.getInput(
				"no-trailing-punctuation-in-subject-lines--whitelist",
			),
		},
	})
}

export function formatIssue(issue: ZodIssue): string {
	const parameterName = issue.path.at(-1) ?? issue.path.join(".")
	return `Input parameter '${parameterName}' ${issue.message}`
}
