import type { Commit, RuleKey } from "+rules"
import type { Configuration } from "./Configuration"

export type Reporter<Report> = (
	invalidCommitsByViolatedRuleKeys: InvalidCommitsByViolatedRuleKey,
) => Report

export type InvalidCommitsByViolatedRuleKey = Readonly<
	Partial<Record<RuleKey, ReadonlyArray<Commit>>>
>

export function violatedRulesReporter(): Reporter<ReadonlyArray<RuleKey>> {
	return (invalidCommitsByViolatedRuleKeys) =>
		Object.keys(invalidCommitsByViolatedRuleKeys) as ReadonlyArray<RuleKey>
}

export function hintedCommitListReporter(
	configuration: Configuration,
): Reporter<string> {
	const indent = "    " // eslint-disable-line unicorn/string-content -- The indent of four spaces is intentional.

	function formatCommit(commit: Commit): string {
		return `${indent + commit.sha} ${commit.originalSubjectLine}`
	}

	// eslint-disable-next-line unicorn/consistent-function-scoping -- `getDetectionMessage` is nested to remain adjacent to the closely related `getHint` function below.
	function getDetectionMessage(ruleKey: RuleKey): string {
		const detectionMessages: Readonly<Record<RuleKey, string>> = {
			"capitalised-subject-lines": `Non-capitalised subject lines detected`,
			"issue-references-in-subject-lines": `Subject lines without issue reference detected`,
			"no-merge-commits": `Merge commits detected`,
			"no-squash-commits": `Squash commits detected`,
			"no-trailing-punctuation-in-subject-lines": `Subject lines with trailing punctuation detected`,
		}

		return detectionMessages[ruleKey]
	}

	function getHint(ruleKey: RuleKey): string {
		const validIssueReferencePatterns =
			configuration.issueReferencesInSubjectLines.patterns.join(" ")

		const hints: Readonly<Record<RuleKey, string>> = {
			"capitalised-subject-lines": `Subject lines (the foremost line in the commit message) must start with an uppercase letter.\n${indent}Please rebase interactively to reword the commits before merging the pull request.`,
			"issue-references-in-subject-lines": `Subject lines (the foremost line in the commit message) must include a reference to an issue in an issue tracking system.\n${indent}Valid patterns: ${validIssueReferencePatterns}\n${indent}Please rebase interactively to reword the commits before merging the pull request.`,
			"no-merge-commits": `They reduce the traceability of the commit history and make it difficult to rebase interactively.\n${indent}Please undo the merge commit and rebase your branch onto the target branch instead.`,
			"no-squash-commits": `Please rebase interactively to consolidate the commits before merging the pull request.`,
			"no-trailing-punctuation-in-subject-lines": `Subject lines (the foremost line in the commit message) must not end with a punctuation mark.\n${indent}Please rebase interactively to reword the commits before merging the pull request.`,
		}

		return hints[ruleKey]
	}

	return (invalidCommitsByViolatedRuleKeys) => {
		const ruleMessages = Object.entries(invalidCommitsByViolatedRuleKeys).map(
			([violatedRuleKey, invalidCommits]) => {
				const detectionMessage = getDetectionMessage(violatedRuleKey as RuleKey)
				const shaCodesAndSubjectLines = invalidCommits
					.map((commit) => formatCommit(commit))
					.join("\n")
				const hint = indent + getHint(violatedRuleKey as RuleKey)

				return `${detectionMessage}:\n${shaCodesAndSubjectLines}\n\n${hint}`
			},
		)

		return ruleMessages.join("\n\n")
	}
}
