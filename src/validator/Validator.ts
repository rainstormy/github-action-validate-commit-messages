import type { RawCommit, Rule, RuleKey } from "+rules"
import {
	acknowledgedAuthorEmailAddresses,
	acknowledgedAuthorNames,
	acknowledgedCommitterEmailAddresses,
	acknowledgedCommitterNames,
	capitalisedSubjectLines,
	commitRefinerFrom,
	emptyLineAfterSubjectLines,
	imperativeSubjectLines,
	issueReferencesInSubjectLines,
	limitLengthOfBodyLines,
	limitLengthOfSubjectLines,
	multiWordSubjectLines,
	noCoAuthors,
	noMergeCommits,
	noRevertRevertCommits,
	noSquashCommits,
	noTrailingPunctuationInSubjectLines,
	noUnexpectedWhitespace,
	parseCommit,
	uniqueSubjectLines,
} from "+rules"
import type {
	Configuration,
	InvalidCommitsByViolatedRuleKey,
	Reporter,
} from "+validator"

export type Validator = <Result>(
	rawCommits: ReadonlyArray<RawCommit>,
	reporter: Reporter<Result>,
) => ReadonlyArray<Result>

export function validatorFrom(configuration: Configuration): Validator {
	const rules: ReadonlyArray<Rule> = rulesFrom(configuration)
	const refineCommit = commitRefinerFrom(rules)

	return <Result>(
		rawCommits: ReadonlyArray<RawCommit>,
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
