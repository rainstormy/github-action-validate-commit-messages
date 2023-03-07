import type { Commit } from "+core"
import type { ApplicableRuleKey, Ruleset } from "+validation"

const ruleDetectionMessages = {
	"capitalised-subject-lines": "Non-capitalised subject lines detected",
	"no-fixup-commits": "Fixup commits detected",
	"no-merge-commits": "Merge commits detected",
	"no-squash-commits": "Squash commits detected",
	"no-trailing-punctuation-in-subject-lines":
		"Subject lines with trailing punctuation detected",
} as const satisfies Readonly<Record<ApplicableRuleKey, string>>

const ruleHints = {
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
} as const satisfies Readonly<Record<ApplicableRuleKey, string>>

const indent = "    " // eslint-disable-line unicorn/string-content -- The indent of four spaces is intentional.

type ReportProps = {
	readonly ruleset: Ruleset
	readonly commitsToValidate: ReadonlyArray<Commit>
}

export function reportOf({
	ruleset,
	commitsToValidate,
}: ReportProps): string | null {
	const ruleMessages = ruleset
		.map((rule) => {
			const invalidCommits = commitsToValidate.filter(
				(commit) => rule.validate(commit) === "invalid",
			)
			return [rule.key, invalidCommits] as const
		})
		.filter(([, invalidCommits]) => invalidCommits.length > 0)
		.map(([key, invalidCommits]) => {
			const indentedShaCodesAndSubjectLines = invalidCommits
				.map((commit) => `${indent + commit.sha} ${commit.originalSubjectLine}`)
				.join("\n")

			return `${
				ruleDetectionMessages[key]
			}:\n${indentedShaCodesAndSubjectLines}\n\n${indent + ruleHints[key]}`
		})

	return ruleMessages.length > 0 ? ruleMessages.join("\n\n") : null
}
