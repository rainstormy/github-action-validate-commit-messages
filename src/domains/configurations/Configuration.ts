import type { NoCoAuthorsOptions } from "#rules/NoCoAuthors.ts"
import type { NoMergeCommitsOptions } from "#rules/NoMergeCommits.ts"
import type { NoRepeatedSubjectLinesOptions } from "#rules/NoRepeatedSubjectLines.ts"
import type { NoRevertRevertCommitsOptions } from "#rules/NoRevertRevertCommits.ts"
import type { NoSingleWordSubjectLinesOptions } from "#rules/NoSingleWordSubjectLines.ts"
import type { NoSquashMarkersOptions } from "#rules/NoSquashMarkers.ts"
import type { NoUnexpectedPunctuationOptions } from "#rules/NoUnexpectedPunctuation.ts"
import type { NoUnexpectedWhitespaceOptions } from "#rules/NoUnexpectedWhitespace.ts"
import type { UseAuthorEmailPatternsOptions } from "#rules/UseAuthorEmailPatterns.ts"
import type { UseAuthorNamePatternsOptions } from "#rules/UseAuthorNamePatterns.ts"
import type { UseCapitalisedSubjectLinesOptions } from "#rules/UseCapitalisedSubjectLines.ts"
import type { UseCommitterEmailPatternsOptions } from "#rules/UseCommitterEmailPatterns.ts"
import type { UseCommitterNamePatternsOptions } from "#rules/UseCommitterNamePatterns.ts"
import type { UseConciseSubjectLinesOptions } from "#rules/UseConciseSubjectLines.ts"
import type { UseEmptyLineBeforeBodyLinesOptions } from "#rules/UseEmptyLineBeforeBodyLines.ts"
import type { UseImperativeSubjectLinesOptions } from "#rules/UseImperativeSubjectLines.ts"
import type { UseIssueLinksOptions } from "#rules/UseIssueLinks.ts"
import type { UseLineWrappingOptions } from "#rules/UseLineWrapping.ts"

export type Configuration = {
	tokens: {
		issueLinkPrefixes: Array<string>
	}

	/**
	 * A record of rule keys to rule-specific options (if the rule is enabled) or null (if the rule is disabled).
	 */
	rules: {
		noCoAuthors: NoCoAuthorsOptions | null
		noMergeCommits: NoMergeCommitsOptions | null
		noRepeatedSubjectLines: NoRepeatedSubjectLinesOptions | null
		noRevertRevertCommits: NoRevertRevertCommitsOptions | null
		noSingleWordSubjectLines: NoSingleWordSubjectLinesOptions | null
		noSquashMarkers: NoSquashMarkersOptions | null
		noUnexpectedPunctuation: NoUnexpectedPunctuationOptions | null
		noUnexpectedWhitespace: NoUnexpectedWhitespaceOptions | null
		useAuthorEmailPatterns: UseAuthorEmailPatternsOptions | null
		useAuthorNamePatterns: UseAuthorNamePatternsOptions | null
		useCapitalisedSubjectLines: UseCapitalisedSubjectLinesOptions | null
		useCommitterEmailPatterns: UseCommitterEmailPatternsOptions | null
		useCommitterNamePatterns: UseCommitterNamePatternsOptions | null
		useConciseSubjectLines: UseConciseSubjectLinesOptions | null
		useEmptyLineBeforeBodyLines: UseEmptyLineBeforeBodyLinesOptions | null
		useImperativeSubjectLines: UseImperativeSubjectLinesOptions | null
		useIssueLinks: UseIssueLinksOptions | null
		useLineWrapping: UseLineWrappingOptions | null
	}
}

export type RuleConfiguration = Configuration["rules"]
export type RuleKey = keyof RuleConfiguration
export type RuleOptions<Key extends RuleKey> = NonNullable<
	RuleConfiguration[Key]
>

export type TokenConfiguration = Configuration["tokens"]
