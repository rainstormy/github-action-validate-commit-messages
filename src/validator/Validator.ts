import type { RawCommit, Rule, RuleKey } from "+rules"
import {
	capitalisedSubjectLines,
	commitRefinerFrom,
	noMergeCommits,
	noSquashCommits,
	noTrailingPunctuationInSubjectLines,
	parseCommit,
} from "+rules"
import type {
	Configuration,
	InvalidCommitsByViolatedRuleKey,
	Reporter,
} from "+validator"

export type Validator = <Report>(
	rawCommits: ReadonlyArray<RawCommit>,
	reporter: Reporter<Report>,
) => Report

export function validatorFrom(configuration: Configuration): Validator {
	const rules: ReadonlyArray<Rule> = rulesFrom(configuration)
	const refineCommit = commitRefinerFrom(rules)

	return <Report>(
		rawCommits: ReadonlyArray<RawCommit>,
		makeReport: Reporter<Report>,
	): Report => {
		const refinedCommits = rawCommits
			.map((rawCommit) => parseCommit(rawCommit))
			.map((parsedCommit) => refineCommit(parsedCommit))

		const invalidCommitsByViolatedRuleKey: InvalidCommitsByViolatedRuleKey =
			Object.fromEntries(
				rules
					.map((rule) => {
						const invalidCommits = refinedCommits.filter(
							(commit) => rule.validate(commit) === "invalid",
						)
						return [rule.key, invalidCommits] as const
					})
					.filter(([, invalidCommits]) => invalidCommits.length > 0),
			)

		return makeReport(invalidCommitsByViolatedRuleKey)
	}
}

export function rulesFrom(configuration: Configuration): ReadonlyArray<Rule> {
	const rules: Readonly<Record<RuleKey, Rule>> = {
		"capitalised-subject-lines": capitalisedSubjectLines(),
		"no-squash-commits": noSquashCommits(configuration.noSquashCommits),
		"no-merge-commits": noMergeCommits(),
		"no-trailing-punctuation-in-subject-lines":
			noTrailingPunctuationInSubjectLines(
				configuration.noTrailingPunctuationInSubjectLines,
			),
	}

	return configuration.ruleKeys.map((ruleKey) => rules[ruleKey])
}
