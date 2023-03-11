import type { Commit } from "+commits"
import type { Configuration } from "+configuration"
import type { Rule, RuleKey } from "+rules"
import {
	capitalisedSubjectLines,
	noFixupCommits,
	noMergeCommits,
	noSquashCommits,
	noTrailingPunctuationInSubjectLines,
} from "+rules"

const indent = "    " // eslint-disable-line unicorn/string-content -- The indent of four spaces is intentional.

type ReportProps = {
	readonly configuration: Configuration
	readonly commitsToValidate: ReadonlyArray<Commit>
}

export function reportFrom({
	configuration,
	commitsToValidate,
}: ReportProps): string {
	const ruleMessages = rulesFrom(configuration)
		.map((rule) => {
			const invalidCommits = commitsToValidate.filter(
				(commit) => rule.validate(commit) === "invalid",
			)
			return [rule.key, invalidCommits] as const
		})
		.filter(([, invalidCommits]) => invalidCommits.length > 0)
		.map(([ruleKey, invalidCommits]) => {
			const detectionMessage = getDetectionMessage(ruleKey)
			const shaCodesAndSubjectLines = invalidCommits
				.map((commit) => `${indent + commit.sha} ${commit.originalSubjectLine}`)
				.join("\n")
			const hint = indent + getHint(ruleKey)

			return `${detectionMessage}:\n${shaCodesAndSubjectLines}\n\n${hint}`
		})

	return ruleMessages.join("\n\n")
}

function rulesFrom(configuration: Configuration): ReadonlyArray<Rule> {
	const rules = {
		"capitalised-subject-lines": capitalisedSubjectLines(),
		"no-fixup-commits": noFixupCommits(),
		"no-squash-commits": noSquashCommits(),
		"no-merge-commits": noMergeCommits(),
		"no-trailing-punctuation-in-subject-lines":
			noTrailingPunctuationInSubjectLines(
				configuration.noTrailingPunctuationInSubjectLines,
			),
	} satisfies Record<RuleKey, Rule>

	return configuration.ruleKeys.map((ruleKey) => rules[ruleKey])
}

function getDetectionMessage(ruleKey: RuleKey): string {
	const detectionMessages = {
		"capitalised-subject-lines": "Non-capitalised subject lines detected",
		"no-fixup-commits": "Fixup commits detected",
		"no-merge-commits": "Merge commits detected",
		"no-squash-commits": "Squash commits detected",
		"no-trailing-punctuation-in-subject-lines":
			"Subject lines with trailing punctuation detected",
	} satisfies Record<RuleKey, string>

	return detectionMessages[ruleKey]
}

function getHint(ruleKey: RuleKey): string {
	const hints = {
		"capitalised-subject-lines":
			"Subject lines (the foremost line in the commit message) must start with an uppercase letter. Please rebase interactively to reword the commits before merging the pull request.",
		"no-fixup-commits":
			"Please rebase interactively to consolidate the fixup commits before merging the pull request.",
		"no-merge-commits":
			"They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.",
		"no-squash-commits":
			"Please rebase interactively to consolidate the squash commits before merging the pull request.",
		"no-trailing-punctuation-in-subject-lines":
			"Subject lines (the foremost line in the commit message) must not end with a punctuation mark. Please rebase interactively to reword the commits before merging the pull request.",
	} satisfies Record<RuleKey, string>

	return hints[ruleKey]
}
