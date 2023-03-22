import type { Commit, IssueReferencePosition, RuleKey } from "+rules"
import { count, pluralise } from "+utilities"
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

export function instructiveReporter(
	configuration: Configuration,
): Reporter<string> {
	const indent = "    " // eslint-disable-line unicorn/string-content -- The indent of four spaces is intentional.

	const nounsByIssueReferencePosition = {
		"as-prefix": "the start",
		"as-suffix": "the end",
	} as const satisfies Record<IssueReferencePosition, string>

	const verbsByIssueReferencePosition = {
		"as-prefix": "start",
		"as-suffix": "end",
	} as const satisfies Record<IssueReferencePosition, string>

	const startOrEndWithIssueReference =
		configuration.issueReferencesInSubjectLines.allowedPositions
			.map((position) => verbsByIssueReferencePosition[position])
			.join(" or ")

	const issueReferenceAtTheStartOrTheEnd =
		configuration.issueReferencesInSubjectLines.allowedPositions
			.map((position) => nounsByIssueReferencePosition[position])
			.join(" or ")

	const indentedListOfIssueReferencePatterns =
		configuration.issueReferencesInSubjectLines.patterns
			.map((pattern) => `${indent}${pattern}`)
			.join("\n")

	const maximumSubjectLineLength = count(
		configuration.limitLineLengths.maximumCharactersInSubjectLine,
		"character",
		"characters",
	)

	const maximumBodyLineLength = count(
		configuration.limitLineLengths.maximumCharactersInBodyLine,
		"character",
		"characters",
	)

	function getInstruction(
		ruleKey: RuleKey,
		invalidCommits: ReadonlyArray<Commit>,
	): string {
		const commitCount = invalidCommits.length

		const bodyOrBodies = pluralise(commitCount, "body", "bodies")
		const commitOrCommits = pluralise(commitCount, "commit", "commits")
		const lineOrLines = pluralise(commitCount, "line", "lines")
		const messageOrMessages = pluralise(commitCount, "message", "messages")
		const oneOrOnes = pluralise(commitCount, "one", "ones")
		const revertOrReverts = pluralise(commitCount, "revert", "reverts")
		const theOrEach = pluralise(commitCount, "the", "each")

		const indentedListOfCommits = invalidCommits
			.map(
				({ originalSubjectLine, sha }) =>
					`${indent}${sha} ${originalSubjectLine.trim()}`,
			)
			.join("\n")

		const instructionsByRule = {
			"capitalised-subject-lines": `Please capitalise the subject ${lineOrLines}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to make the foremost line start with an uppercase letter.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.`,

			"empty-line-after-subject-lines": `Please separate the subject ${lineOrLines} from the message ${bodyOrBodies} with an empty line:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to insert an empty line before the message body.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.`,

			"imperative-subject-lines": `Please start the subject ${lineOrLines} with a verb in the imperative mood:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to make the foremost line start with a verb that reads like an instruction.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.\n
${indent}For example, instead of 'Added a feature', 'Formatting', 'It works', or 'Always validate',
${indent}prefer 'Add a feature', 'Format the code', 'Make it work', or 'Do the validation every time'.`,

			"issue-references-in-subject-lines": `Please include an issue reference at ${issueReferenceAtTheStartOrTheEnd} of the subject ${lineOrLines}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to make the foremost line ${startOrEndWithIssueReference} with a reference to an issue tracking system.
${indent}Providing more context in the commit ${messageOrMessages} will help you preserve the traceability of the commit history.\n
${indent}Valid issue reference patterns:
${indentedListOfIssueReferencePatterns}`,

			"limit-line-lengths": `Please wrap long lines of text:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to shorten or wrap long lines of text.
${indent}Keeping the lines short will help you preserve the readability of the commit history in various Git clients.\n
${indent}The foremost line in the commit message must not exceed ${maximumSubjectLineLength}.
${indent}Each line in the message body must not exceed ${maximumBodyLineLength}.`,

			"multi-word-subject-lines": `Please include at least two words in the subject ${lineOrLines}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to make the foremost line contain at least two words.
${indent}Providing more context in the commit ${messageOrMessages} will help you preserve the traceability of the commit history.`,

			"no-co-authors": `Please avoid having co-authors in the ${commitOrCommits}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to remove the 'Co-authored-by:' trailers in the message body.
${indent}Removing the co-authors will help you preserve the authenticity of the ${commitOrCommits}, as co-authors are unable to sign commits.`,

			"no-merge-commits": `Please avoid the merge ${commitOrCommits}:
${indentedListOfCommits}\n
${indent}Undo the merge ${commitOrCommits} and rebase your branch onto the target branch instead.
${indent}Avoiding merge commits will help you preserve the traceability of the commit history as well as the ability to rebase interactively.`,

			"no-revert-revert-commits": `Please consolidate the ${revertOrReverts} of the revert ${commitOrCommits}:
${indentedListOfCommits}\n
${indent}Undo the ${revertOrReverts} of the revert ${commitOrCommits} and re-apply the original ${commitOrCommits}.
${indent}Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,

			"no-squash-commits": `Please consolidate the squash ${commitOrCommits}:
${indentedListOfCommits}\n
${indent}Rebase interactively to combine the ${commitOrCommits} with the original ${oneOrOnes}.
${indent}Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,

			"no-trailing-punctuation-in-subject-lines": `Please avoid trailing punctuation in the subject ${lineOrLines}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to delete the punctuation characters at the end of the foremost line.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.`,

			"no-unexpected-whitespace": `Please avoid unexpected whitespace:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to remove leading, trailing, and consecutive whitespace characters. Indentation is allowed in the message body.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.`,
		} as const satisfies Record<RuleKey, string>

		return instructionsByRule[ruleKey]
	}

	return (invalidCommitsByViolatedRuleKeys) => {
		const ruleMessages = Object.entries(invalidCommitsByViolatedRuleKeys).map(
			([violatedRuleKey, invalidCommits]) =>
				getInstruction(violatedRuleKey as RuleKey, invalidCommits),
		)

		return ruleMessages.join("\n\n")
	}
}
