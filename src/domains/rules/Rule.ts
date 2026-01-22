import type { Commits } from "#commits/Commit.ts"
import type {
	Configuration,
	RuleConfiguration,
	RuleKey,
	RuleOptions,
} from "#configurations/Configuration.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { noExcessiveCommitsPerBranch } from "#rules/NoExcessiveCommitsPerBranch.ts"
import { noMergeCommits } from "#rules/NoMergeCommits.ts"
import { noRepeatedSubjectLines } from "#rules/NoRepeatedSubjectLines.ts"
import { noRestrictedFooterLines } from "#rules/NoRestrictedFooterLines.ts"
import { noRevertRevertCommits } from "#rules/NoRevertRevertCommits.ts"
import { noSingleWordSubjectLines } from "#rules/NoSingleWordSubjectLines.ts"
import { noSquashMarkers } from "#rules/NoSquashMarkers.ts"
import { noUnexpectedPunctuation } from "#rules/NoUnexpectedPunctuation.ts"
import { noUnexpectedWhitespace } from "#rules/NoUnexpectedWhitespace.ts"
import { useAuthorEmailPatterns } from "#rules/UseAuthorEmailPatterns.ts"
import { useAuthorNamePatterns } from "#rules/UseAuthorNamePatterns.ts"
import { useCapitalisedSubjectLines } from "#rules/UseCapitalisedSubjectLines.ts"
import { useCommitterEmailPatterns } from "#rules/UseCommitterEmailPatterns.ts"
import { useCommitterNamePatterns } from "#rules/UseCommitterNamePatterns.ts"
import { useConciseSubjectLines } from "#rules/UseConciseSubjectLines.ts"
import { useEmptyLineBeforeBodyLines } from "#rules/UseEmptyLineBeforeBodyLines.ts"
import { useImperativeSubjectLines } from "#rules/UseImperativeSubjectLines.ts"
import { useIssueLinks } from "#rules/UseIssueLinks.ts"
import { useLineWrapping } from "#rules/UseLineWrapping.ts"
import { useSignedCommits } from "#rules/UseSignedCommits.ts"
import { notNullishValue } from "#utilities/Arrays.ts"

export type Rule = (commits: Commits) => Concerns
export type Rules = Array<Rule>

type RuleFactory = {
	[Key in RuleKey]: (options: RuleOptions<Key>) => Rule
}

const rules: RuleFactory = {
	noExcessiveCommitsPerBranch,
	noMergeCommits,
	noRepeatedSubjectLines,
	noRestrictedFooterLines,
	noRevertRevertCommits,
	noSingleWordSubjectLines,
	noSquashMarkers,
	noUnexpectedPunctuation,
	noUnexpectedWhitespace,
	useAuthorEmailPatterns,
	useAuthorNamePatterns,
	useCapitalisedSubjectLines,
	useCommitterEmailPatterns,
	useCommitterNamePatterns,
	useConciseSubjectLines,
	useEmptyLineBeforeBodyLines,
	useImperativeSubjectLines,
	useIssueLinks,
	useLineWrapping,
	useSignedCommits,
}

export function mapCommitsToConcerns(
	_commits: Commits,
	configuration: Configuration,
): Concerns {
	const _rules = getEnabledRules(configuration.rules)
	return []
}

function getEnabledRules(configuration: RuleConfiguration): Rules {
	return Object.entries(configuration)
		.filter(notNullishValue)
		.map(([key, options]) => rule(key as RuleKey, options))
}

function rule<Key extends RuleKey>(key: Key, options: RuleOptions<Key>): Rule {
	return rules[key](options)
}
