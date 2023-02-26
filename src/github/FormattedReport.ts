import type { ApplicableRuleKey, Report } from "+validation"

const ruleDetectionMessages = {
	"require-capitalised-subject-lines": "Non-capitalised subject lines detected",
	"require-non-fixup-commits": "Fixup commits detected",
	"require-non-merge-commits": "Merge commits detected",
	"require-non-squash-commits": "Squash commits detected",
} as const satisfies Readonly<Record<ApplicableRuleKey, string>>

const ruleHints = {
	"require-capitalised-subject-lines":
		"Subject lines (the foremost line in the commit message) must start with an uppercase letter. Please rebase interactively to reword the commits before merging the pull request.",
	"require-non-fixup-commits":
		"Please rebase interactively to consolidate the fixup commits before merging the pull request.",
	"require-non-merge-commits":
		"They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.",
	"require-non-squash-commits":
		"Please rebase interactively to consolidate the squash commits before merging the pull request.",
} as const satisfies Readonly<Record<ApplicableRuleKey, string>>

const indent = "    " // eslint-disable-line unicorn/string-content -- The indent of four spaces is intentional.

export function formattedReportFrom(report: Report): string | null {
	const messages = Object.entries(report).map(([key, violatingCommits]) => {
		const ruleKey = key as ApplicableRuleKey

		const ruleDetectionMessage = ruleDetectionMessages[ruleKey]
		const indentedRuleHint = indent + ruleHints[ruleKey]
		const indentedShaCodesAndSubjectLines = violatingCommits
			.map((commit) => `${indent + commit.sha} ${commit.toString()}`)
			.join("\n")

		return `${ruleDetectionMessage}:\n${indentedShaCodesAndSubjectLines}\n\n${indentedRuleHint}`
	})

	return messages.length > 0 ? messages.join("\n\n") : null
}
