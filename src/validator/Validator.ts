import { acknowledgedAuthorEmailAddresses } from "+rules/AcknowledgedAuthorEmailAddresses/AcknowledgedAuthorEmailAddresses"
import { acknowledgedAuthorNames } from "+rules/AcknowledgedAuthorNames/AcknowledgedAuthorNames"
import { acknowledgedCommitterEmailAddresses } from "+rules/AcknowledgedCommitterEmailAddresses/AcknowledgedCommitterEmailAddresses"
import { acknowledgedCommitterNames } from "+rules/AcknowledgedCommitterNames/AcknowledgedCommitterNames"
import { capitalisedSubjectLines } from "+rules/CapitalisedSubjectLines/CapitalisedSubjectLines"
import { type RawCommits, parseCommit } from "+rules/Commit"
import { commitRefinerFrom } from "+rules/CommitRefiner"
import { emptyLineAfterSubjectLines } from "+rules/EmptyLineAfterSubjectLines/EmptyLineAfterSubjectLines"
import { imperativeSubjectLines } from "+rules/ImperativeSubjectLines/ImperativeSubjectLines"
import { issueReferencesInSubjectLines } from "+rules/IssueReferencesInSubjectLines/IssueReferencesInSubjectLines"
import { limitLengthOfBodyLines } from "+rules/LimitLengthOfBodyLines/LimitLengthOfBodyLines"
import { limitLengthOfSubjectLines } from "+rules/LimitLengthOfSubjectLines/LimitLengthOfSubjectLines"
import { multiWordSubjectLines } from "+rules/MultiWordSubjectLines/MultiWordSubjectLines"
import { noCoAuthors } from "+rules/NoCoAuthors/NoCoAuthors"
import { noMergeCommits } from "+rules/NoMergeCommits/NoMergeCommits"
import { noRevertRevertCommits } from "+rules/NoRevertRevertCommits/NoRevertRevertCommits"
import { noSquashCommits } from "+rules/NoSquashCommits/NoSquashCommits"
import { noTrailingPunctuationInSubjectLines } from "+rules/NoTrailingPunctuationInSubjectLines/NoTrailingPunctuationInSubjectLines"
import { noUnexpectedWhitespace } from "+rules/NoUnexpectedWhitespace/NoUnexpectedWhitespace"
import type { Rule, RuleKey } from "+rules/Rule"
import { uniqueSubjectLines } from "+rules/UniqueSubjectLines/UniqueSubjectLines"
import type { Configuration } from "+validator/Configuration"
import type {
	InvalidCommitsByViolatedRuleKey,
	Reporter,
} from "+validator/Reporter"

export type Validator = <Result>(
	rawCommits: RawCommits,
	reporter: Reporter<Result>,
) => ReadonlyArray<Result>

export function validatorFrom(configuration: Configuration): Validator {
	const rules: ReadonlyArray<Rule> = rulesFrom(configuration)
	const refineCommit = commitRefinerFrom(rules)

	return <Result>(
		rawCommits: RawCommits,
		makeReport: Reporter<Result>,
	): ReadonlyArray<Result> => {
		const refinedCommits = rawCommits
			.map((rawCommit) => parseCommit(rawCommit))
			.map((parsedCommit) => refineCommit(parsedCommit))

		const invalidCommitsByViolatedRuleKey: InvalidCommitsByViolatedRuleKey =
			Object.fromEntries(
				rules
					.map((rule) => {
						const invalidCommits = rule.getInvalidCommits(refinedCommits)
						return [rule.key, invalidCommits] as const
					})
					.filter(([, invalidCommits]) => invalidCommits.length > 0),
			)

		return makeReport(invalidCommitsByViolatedRuleKey)
	}
}

export function rulesFrom(configuration: Configuration): ReadonlyArray<Rule> {
	function getRuleFromKey(ruleKey: RuleKey): Rule {
		switch (ruleKey) {
			case "acknowledged-author-email-addresses": {
				return acknowledgedAuthorEmailAddresses(
					configuration.acknowledgedAuthorEmailAddresses,
				)
			}
			case "acknowledged-author-names": {
				return acknowledgedAuthorNames(configuration.acknowledgedAuthorNames)
			}
			case "acknowledged-committer-email-addresses": {
				return acknowledgedCommitterEmailAddresses(
					configuration.acknowledgedCommitterEmailAddresses,
				)
			}
			case "acknowledged-committer-names": {
				return acknowledgedCommitterNames(
					configuration.acknowledgedCommitterNames,
				)
			}
			case "capitalised-subject-lines": {
				return capitalisedSubjectLines()
			}
			case "empty-line-after-subject-lines": {
				return emptyLineAfterSubjectLines()
			}
			case "imperative-subject-lines": {
				return imperativeSubjectLines(configuration.imperativeSubjectLines)
			}
			case "issue-references-in-subject-lines": {
				return issueReferencesInSubjectLines(
					configuration.issueReferencesInSubjectLines,
				)
			}
			case "limit-length-of-body-lines": {
				return limitLengthOfBodyLines(configuration.limitLengthOfBodyLines)
			}
			case "limit-length-of-subject-lines": {
				return limitLengthOfSubjectLines(
					configuration.limitLengthOfSubjectLines,
				)
			}
			case "multi-word-subject-lines": {
				return multiWordSubjectLines()
			}
			case "no-co-authors": {
				return noCoAuthors()
			}
			case "no-squash-commits": {
				return noSquashCommits(configuration.noSquashCommits)
			}
			case "no-merge-commits": {
				return noMergeCommits()
			}
			case "no-revert-revert-commits": {
				return noRevertRevertCommits()
			}
			case "no-trailing-punctuation-in-subject-lines": {
				return noTrailingPunctuationInSubjectLines(
					configuration.noTrailingPunctuationInSubjectLines,
				)
			}
			case "no-unexpected-whitespace": {
				return noUnexpectedWhitespace()
			}

			case "unique-subject-lines": {
				return uniqueSubjectLines()
			}
		}
	}

	return configuration.ruleKeys.map((ruleKey) => getRuleFromKey(ruleKey))
}
