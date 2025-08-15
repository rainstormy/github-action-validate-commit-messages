import { legacyV1AcknowledgedAuthorEmailAddresses } from "#legacy-v1/rules/AcknowledgedAuthorEmailAddresses/LegacyV1AcknowledgedAuthorEmailAddresses"
import { legacyV1AcknowledgedAuthorNames } from "#legacy-v1/rules/AcknowledgedAuthorNames/LegacyV1AcknowledgedAuthorNames"
import { legacyV1AcknowledgedCommitterEmailAddresses } from "#legacy-v1/rules/AcknowledgedCommitterEmailAddresses/LegacyV1AcknowledgedCommitterEmailAddresses"
import { legacyV1AcknowledgedCommitterNames } from "#legacy-v1/rules/AcknowledgedCommitterNames/LegacyV1AcknowledgedCommitterNames"
import { legacyV1CapitalisedSubjectLines } from "#legacy-v1/rules/CapitalisedSubjectLines/LegacyV1CapitalisedSubjectLines"
import { legacyV1EmptyLineAfterSubjectLines } from "#legacy-v1/rules/EmptyLineAfterSubjectLines/LegacyV1EmptyLineAfterSubjectLines"
import { legacyV1ImperativeSubjectLines } from "#legacy-v1/rules/ImperativeSubjectLines/LegacyV1ImperativeSubjectLines"
import { legacyV1IssueReferencesInSubjectLines } from "#legacy-v1/rules/IssueReferencesInSubjectLines/LegacyV1IssueReferencesInSubjectLines"
import {
	type LegacyV1RawCommits,
	legacyV1ParseCommit,
} from "#legacy-v1/rules/LegacyV1Commit"
import { legacyV1CommitRefinerFrom } from "#legacy-v1/rules/LegacyV1CommitRefiner"
import type {
	LegacyV1Rule,
	LegacyV1RuleKey,
} from "#legacy-v1/rules/LegacyV1Rule"
import { legacyV1LimitLengthOfBodyLines } from "#legacy-v1/rules/LimitLengthOfBodyLines/LegacyV1LimitLengthOfBodyLines"
import { legacyV1LimitLengthOfSubjectLines } from "#legacy-v1/rules/LimitLengthOfSubjectLines/LegacyV1LimitLengthOfSubjectLines"
import { legacyV1MultiWordSubjectLines } from "#legacy-v1/rules/MultiWordSubjectLines/LegacyV1MultiWordSubjectLines"
import { legacyV1NoCoAuthors } from "#legacy-v1/rules/NoCoAuthors/LegacyV1NoCoAuthors"
import { legacyV1NoMergeCommits } from "#legacy-v1/rules/NoMergeCommits/LegacyV1NoMergeCommits"
import { legacyV1NoRevertRevertCommits } from "#legacy-v1/rules/NoRevertRevertCommits/LegacyV1NoRevertRevertCommits"
import { legacyV1NoSquashCommits } from "#legacy-v1/rules/NoSquashCommits/LegacyV1NoSquashCommits"
import { legacyV1NoTrailingPunctuationInSubjectLines } from "#legacy-v1/rules/NoTrailingPunctuationInSubjectLines/LegacyV1NoTrailingPunctuationInSubjectLines"
import { legacyV1NoUnexpectedWhitespace } from "#legacy-v1/rules/NoUnexpectedWhitespace/LegacyV1NoUnexpectedWhitespace"
import { legacyV1UniqueSubjectLines } from "#legacy-v1/rules/UniqueSubjectLines/LegacyV1UniqueSubjectLines"
import type { LegacyV1Configuration } from "#legacy-v1/validator/LegacyV1Configuration"
import type {
	LegacyV1InvalidCommitsByViolatedRuleKey,
	LegacyV1Reporter,
} from "#legacy-v1/validator/LegacyV1Reporter"

export type LegacyV1Validator = <Result>(
	rawCommits: LegacyV1RawCommits,
	reporter: LegacyV1Reporter<Result>,
) => ReadonlyArray<Result>

export function legacyV1ValidatorFrom(
	configuration: LegacyV1Configuration,
): LegacyV1Validator {
	const rules: ReadonlyArray<LegacyV1Rule> = legacyV1RulesFrom(configuration)
	const refineCommit = legacyV1CommitRefinerFrom(rules)

	return <Result>(
		rawCommits: LegacyV1RawCommits,
		makeReport: LegacyV1Reporter<Result>,
	): ReadonlyArray<Result> => {
		const refinedCommits = rawCommits
			.map((rawCommit) => legacyV1ParseCommit(rawCommit))
			.map((parsedCommit) => refineCommit(parsedCommit))

		const invalidCommitsByViolatedRuleKey: LegacyV1InvalidCommitsByViolatedRuleKey =
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

export function legacyV1RulesFrom(
	configuration: LegacyV1Configuration,
): ReadonlyArray<LegacyV1Rule> {
	function getRuleFromKey(ruleKey: LegacyV1RuleKey): LegacyV1Rule {
		switch (ruleKey) {
			case "acknowledged-author-email-addresses": {
				return legacyV1AcknowledgedAuthorEmailAddresses(
					configuration.acknowledgedAuthorEmailAddresses,
				)
			}
			case "acknowledged-author-names": {
				return legacyV1AcknowledgedAuthorNames(
					configuration.acknowledgedAuthorNames,
				)
			}
			case "acknowledged-committer-email-addresses": {
				return legacyV1AcknowledgedCommitterEmailAddresses(
					configuration.acknowledgedCommitterEmailAddresses,
				)
			}
			case "acknowledged-committer-names": {
				return legacyV1AcknowledgedCommitterNames(
					configuration.acknowledgedCommitterNames,
				)
			}
			case "capitalised-subject-lines": {
				return legacyV1CapitalisedSubjectLines()
			}
			case "empty-line-after-subject-lines": {
				return legacyV1EmptyLineAfterSubjectLines()
			}
			case "imperative-subject-lines": {
				return legacyV1ImperativeSubjectLines(
					configuration.imperativeSubjectLines,
				)
			}
			case "issue-references-in-subject-lines": {
				return legacyV1IssueReferencesInSubjectLines(
					configuration.issueReferencesInSubjectLines,
				)
			}
			case "limit-length-of-body-lines": {
				return legacyV1LimitLengthOfBodyLines(
					configuration.limitLengthOfBodyLines,
				)
			}
			case "limit-length-of-subject-lines": {
				return legacyV1LimitLengthOfSubjectLines(
					configuration.limitLengthOfSubjectLines,
				)
			}
			case "multi-word-subject-lines": {
				return legacyV1MultiWordSubjectLines()
			}
			case "no-co-authors": {
				return legacyV1NoCoAuthors()
			}
			case "no-squash-commits": {
				return legacyV1NoSquashCommits(configuration.noSquashCommits)
			}
			case "no-merge-commits": {
				return legacyV1NoMergeCommits()
			}
			case "no-revert-revert-commits": {
				return legacyV1NoRevertRevertCommits()
			}
			case "no-trailing-punctuation-in-subject-lines": {
				return legacyV1NoTrailingPunctuationInSubjectLines(
					configuration.noTrailingPunctuationInSubjectLines,
				)
			}
			case "no-unexpected-whitespace": {
				return legacyV1NoUnexpectedWhitespace()
			}

			case "unique-subject-lines": {
				return legacyV1UniqueSubjectLines()
			}
		}
	}

	return configuration.ruleKeys.map((ruleKey) => getRuleFromKey(ruleKey))
}
