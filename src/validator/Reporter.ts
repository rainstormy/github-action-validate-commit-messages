import type { Commit } from "+rules/Commit"
import type { IssueReferencePosition } from "+rules/IssueReferencesInSubjectLines/IssueReferencesInSubjectLinesConfiguration"
import type { RuleKey, RuleKeys } from "+rules/Rule"
import { count, pluralise } from "+utilities/StringUtilities"
import type { Configuration } from "+validator/Configuration"

export type Reporter<Result> = (
	invalidCommitsByViolatedRuleKeys: InvalidCommitsByViolatedRuleKey,
) => ReadonlyArray<Result>

export type InvalidCommitsByViolatedRuleKey = Readonly<
	Partial<Record<RuleKey, ReadonlyArray<Commit>>>
>

export function violatedRulesReporter(): Reporter<RuleKey> {
	return (invalidCommitsByViolatedRuleKeys): RuleKeys =>
		Object.keys(invalidCommitsByViolatedRuleKeys) as RuleKeys
}

export function instructiveReporter(
	configuration: Configuration,
): Reporter<string> {
	const indent = "    "

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
		const repeatsOrRepeat = pluralise(commitCount, "repeats", "repeat")
		const revertOrReverts = pluralise(commitCount, "revert", "reverts")
		const theOrEach = pluralise(commitCount, "the", "each")

		const shaLengthToDisplay = 7

		const indentedListOfCommits = invalidCommits
			.map(
				({ originalSubjectLine, sha }) =>
					`${indent}${sha.slice(0, shaLengthToDisplay)} ${originalSubjectLine.trim()}`,
			)
			.join("\n")

		switch (ruleKey) {
			case "acknowledged-author-email-addresses": {
				return `Please use ${anOrNothing}acknowledged author email ${addressOrAddresses}:
${indentedListOfCommits}\n
${indent}Edit ${theOrEach} commit to change the email address of its author.
${indent}Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.\n
${indent}Valid author email address patterns:
${indentedListOfAuthorEmailAddressPatterns}`
			}

			case "acknowledged-author-names": {
				return `Please use ${anOrNothing}acknowledged author ${nameOrNames}:
${indentedListOfCommits}\n
${indent}Edit ${theOrEach} commit to change the name of its author.
${indent}Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.\n
${indent}Valid author name patterns:
${indentedListOfAuthorNamePatterns}`
			}

			case "acknowledged-committer-email-addresses": {
				return `Please use ${anOrNothing}acknowledged committer email ${addressOrAddresses}:
${indentedListOfCommits}\n
${indent}Edit ${theOrEach} commit to change the email address of its committer.
${indent}Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.\n
${indent}Valid committer email address patterns:
${indentedListOfCommitterEmailAddressPatterns}`
			}

			case "acknowledged-committer-names": {
				return `Please use ${anOrNothing}acknowledged committer ${nameOrNames}:
${indentedListOfCommits}\n
${indent}Edit ${theOrEach} commit to change the name of its committer.
${indent}Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.\n
${indent}Valid committer name patterns:
${indentedListOfCommitterNamePatterns}`
			}

			case "capitalised-subject-lines": {
				return `Please capitalise the subject ${lineOrLines}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to make the foremost line start with an uppercase letter.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.`
			}

			case "empty-line-after-subject-lines": {
				return `Please separate the subject ${lineOrLines} from the message ${bodyOrBodies} with an empty line:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to insert an empty line before the message body.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.`
			}

			case "imperative-subject-lines": {
				return `Please start the subject ${lineOrLines} with a verb in the imperative mood:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to make the foremost line start with a verb that reads like an instruction.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.\n
${indent}For example, instead of 'Added a feature', 'Formatting', 'It works', or 'Always validate',
${indent}prefer 'Add a feature', 'Format the code', 'Make it work', or 'Do the validation every time'.`
			}

			case "issue-references-in-subject-lines": {
				return `Please include an issue reference at ${issueReferenceAtTheStartOrTheEnd} of the subject ${lineOrLines}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to make the foremost line ${startOrEndWithIssueReference} with a reference to an issue tracking system.
${indent}Providing more context in the commit ${messageOrMessages} will help you preserve the traceability of the commit history.\n
${indent}Valid issue reference patterns:
${indentedListOfIssueReferencePatterns}`
			}

			case "limit-length-of-body-lines": {
				return `Please wrap long lines in the message ${bodyOrBodies}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to keep each line in the message body within ${maximumBodyLineLength}.
${indent}Keeping the body lines short will help you preserve the readability of the commit history in various Git clients.`
			}

			case "limit-length-of-subject-lines": {
				return `Please keep the subject ${lineOrLines} concise:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to keep the foremost line within ${maximumSubjectLineLength}.
${indent}Keeping the subject ${lineOrLines} short will help you preserve the readability of the commit history in various Git clients.`
			}

			case "multi-word-subject-lines": {
				return `Please include at least two words in the subject ${lineOrLines}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to make the foremost line contain at least two words.
${indent}Providing more context in the commit ${messageOrMessages} will help you preserve the traceability of the commit history.`
			}

			case "no-co-authors": {
				return `Please avoid having co-authors in the ${commitOrCommits}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to remove the 'Co-authored-by:' trailers in the message body.
${indent}Removing the co-authors will help you preserve the authenticity of the ${commitOrCommits}, as co-authors are unable to sign commits.`
			}

			case "no-merge-commits": {
				return `Please avoid the merge ${commitOrCommits}:
${indentedListOfCommits}\n
${indent}Undo the merge ${commitOrCommits} and rebase your branch onto the target branch instead.
${indent}Avoiding merge commits will help you preserve the traceability of the commit history as well as the ability to rebase interactively.`
			}

			case "no-revert-revert-commits": {
				return `Please consolidate the ${revertOrReverts} of the revert ${commitOrCommits}:
${indentedListOfCommits}\n
${indent}Undo the ${revertOrReverts} of the revert ${commitOrCommits} and re-apply the original ${commitOrCommits}.
${indent}Avoiding unnecessary commits will help you preserve the traceability of the commit history.`
			}

			case "no-squash-commits": {
				return `Please consolidate the squash ${commitOrCommits}:
${indentedListOfCommits}\n
${indent}Rebase interactively to combine the ${commitOrCommits} with the original ${oneOrOnes}.
${indent}Avoiding unnecessary commits will help you preserve the traceability of the commit history.`
			}

			case "no-trailing-punctuation-in-subject-lines": {
				return `Please avoid trailing punctuation in the subject ${lineOrLines}:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to delete the punctuation characters at the end of the foremost line.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.`
			}

			case "no-unexpected-whitespace": {
				return `Please avoid unexpected whitespace:
${indentedListOfCommits}\n
${indent}Reword ${theOrEach} commit message to remove leading, trailing, and consecutive whitespace characters. Indentation is allowed in the message body.
${indent}Standardising the commit message format will help you preserve the readability of the commit history.`
			}

			case "unique-subject-lines": {
				return `Please consolidate the ${commitOrCommits} that ${repeatsOrRepeat} the subject line of a previous commit:
${indentedListOfCommits}\n
${indent}Rebase interactively to combine the ${commitOrCommits} with the previous one.
${indent}Avoiding unnecessary commits will help you preserve the traceability of the commit history.`
			}
		}
	}

	return (invalidCommitsByViolatedRuleKeys): ReadonlyArray<string> =>
		Object.entries(invalidCommitsByViolatedRuleKeys).map(
			([violatedRuleKey, invalidCommits]) =>
				getInstruction(violatedRuleKey as RuleKey, invalidCommits),
		)
}
