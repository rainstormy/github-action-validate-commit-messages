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

	const indentedListOfAuthorEmailAddressPatterns =
		configuration.acknowledgedAuthorEmailAddresses.patterns
			.map((pattern) => `${indent}${pattern}`)
			.join("\n")

	const indentedListOfAuthorNamePatterns =
		configuration.acknowledgedAuthorNames.patterns
			.map((pattern) => `${indent}${pattern}`)
			.join("\n")

	const indentedListOfCommitterEmailAddressPatterns =
		configuration.acknowledgedCommitterEmailAddresses.patterns
			.map((pattern) => `${indent}${pattern}`)
			.join("\n")

	const indentedListOfCommitterNamePatterns =
		configuration.acknowledgedCommitterNames.patterns
			.map((pattern) => `${indent}${pattern}`)
			.join("\n")

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

	const maximumBodyLineLength = count(
		configuration.limitLengthOfBodyLines.maximumCharacters,
		"character",
		"characters",
	)

	const maximumSubjectLineLength = count(
		configuration.limitLengthOfSubjectLines.maximumCharacters,
		"character",
		"characters",
	)

	function getInstruction(
		ruleKey: RuleKey,
		invalidCommits: ReadonlyArray<Commit>,
	): string {
		const commitCount = invalidCommits.length

		const addressOrAddresses = pluralise(commitCount, "address", "addresses")
		const anOrNothing = pluralise(commitCount, "an ", "")
		const bodyOrBodies = pluralise(commitCount, "body", "bodies")
		const commitOrCommits = pluralise(commitCount, "commit", "commits")
		const lineOrLines = pluralise(commitCount, "line", "lines")
		const messageOrMessages = pluralise(commitCount, "message", "messages")
		const nameOrNames = pluralise(commitCount, "name", "names")
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
			"acknowledged-author-email-addresses": `Please use ${anOrNothing}acknowledged author email ${addressOrAddresses}:
${indentedListOfCommits}\n
${indent}Edit ${theOrEach} commit to change the email address of its author.
${indent}Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.\n
${indent}Valid author email address patterns:
${indentedListOfAuthorEmailAddressPatterns}`,

			"acknowledged-author-names": `Please use ${anOrNothing}acknowledged author ${nameOrNames}:
${indentedListOfCommits}\n
${indent}Edit ${theOrEach} commit to change the name of its author.
${indent}Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.\n
${indent}Valid author name patterns:
${indentedListOfAuthorNamePatterns}`,

			"acknowledged-committer-email-addresses": `Please use ${anOrNothing}acknowledged committer email ${addressOrAddresses}:
${indentedListOfCommits}\n
${indent}Edit ${theOrEach} commit to change the email address of its committer.
${indent}Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.\n
${indent}Valid committer email address patterns:
${indentedListOfCommitterEmailAddressPatterns}`,

			"acknowledged-committer-names": `Please use ${anOrNothing}acknowledged committer ${nameOrNames}:
${indentedListOfCommits}\n
${indent}Edit ${theOrEach} commit to change the name of its committer.
${indent}Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.\n
${indent}Valid committer name patterns:
${indentedListOfCommitterNamePatterns}`,

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

			"limit-length-of-body-lines": `Please wrap long lines in the message ${bodyOrBodies}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to keep each line in the message body within ${maximumBodyLineLength}.
${indent}Keeping the body lines short will help you preserve the readability of the commit history in various Git clients.`,

			"limit-length-of-subject-lines": `Please keep the subject ${lineOrLines} concise:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to keep the foremost line within ${maximumSubjectLineLength}.
${indent}Keeping the subject ${lineOrLines} short will help you preserve the readability of the commit history in various Git clients.`,

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
