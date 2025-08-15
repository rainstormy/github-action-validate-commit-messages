import { acknowledgedAuthorEmailAddresses } from "#legacy-v1/rules/AcknowledgedAuthorEmailAddresses/AcknowledgedAuthorEmailAddresses"
import { acknowledgedAuthorNames } from "#legacy-v1/rules/AcknowledgedAuthorNames/AcknowledgedAuthorNames"
import { acknowledgedCommitterEmailAddresses } from "#legacy-v1/rules/AcknowledgedCommitterEmailAddresses/AcknowledgedCommitterEmailAddresses"
import { acknowledgedCommitterNames } from "#legacy-v1/rules/AcknowledgedCommitterNames/AcknowledgedCommitterNames"
import { capitalisedSubjectLines } from "#legacy-v1/rules/CapitalisedSubjectLines/CapitalisedSubjectLines"
import { type RawCommits, parseCommit } from "#legacy-v1/rules/Commit"
import { commitRefinerFrom } from "#legacy-v1/rules/CommitRefiner"
import { emptyLineAfterSubjectLines } from "#legacy-v1/rules/EmptyLineAfterSubjectLines/EmptyLineAfterSubjectLines"
import { imperativeSubjectLines } from "#legacy-v1/rules/ImperativeSubjectLines/ImperativeSubjectLines"
import { issueReferencesInSubjectLines } from "#legacy-v1/rules/IssueReferencesInSubjectLines/IssueReferencesInSubjectLines"
import { limitLengthOfBodyLines } from "#legacy-v1/rules/LimitLengthOfBodyLines/LimitLengthOfBodyLines"
import { limitLengthOfSubjectLines } from "#legacy-v1/rules/LimitLengthOfSubjectLines/LimitLengthOfSubjectLines"
import { multiWordSubjectLines } from "#legacy-v1/rules/MultiWordSubjectLines/MultiWordSubjectLines"
import { noCoAuthors } from "#legacy-v1/rules/NoCoAuthors/NoCoAuthors"
import { noMergeCommits } from "#legacy-v1/rules/NoMergeCommits/NoMergeCommits"
import { noRevertRevertCommits } from "#legacy-v1/rules/NoRevertRevertCommits/NoRevertRevertCommits"
import { noSquashCommits } from "#legacy-v1/rules/NoSquashCommits/NoSquashCommits"
import { noTrailingPunctuationInSubjectLines } from "#legacy-v1/rules/NoTrailingPunctuationInSubjectLines/NoTrailingPunctuationInSubjectLines"
import { noUnexpectedWhitespace } from "#legacy-v1/rules/NoUnexpectedWhitespace/NoUnexpectedWhitespace"
import type { Rule, RuleKey } from "#legacy-v1/rules/Rule"
import { uniqueSubjectLines } from "#legacy-v1/rules/UniqueSubjectLines/UniqueSubjectLines"
import type { Configuration } from "#legacy-v1/validator/Configuration"
import type {
	InvalidCommitsByViolatedRuleKey,
	Reporter,
} from "#legacy-v1/validator/Reporter"

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
