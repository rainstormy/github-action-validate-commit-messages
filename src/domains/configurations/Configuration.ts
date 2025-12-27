import type { EmptyObject } from "#types/EmptyObject.ts"

export type Configuration = {
	/**
	 * A record of rule keys to rule-specific options (if the rule is enabled) or null (if the rule is disabled).
	 */
	rules: {
		noCoAuthors: EmptyObject | null
		noMergeCommits: EmptyObject | null
		noRepeatedSubjectLines: EmptyObject | null
		noRevertRevertCommits: EmptyObject | null
		noSingleWordSubjectLines: EmptyObject | null
		noSquashMarkers: EmptyObject | null // TODO: Rule options for `noSquashMarkers`.
		noUnexpectedPunctuation: EmptyObject | null // TODO: Rule options for `noUnexpectedPunctuation`.
		noUnexpectedWhitespace: EmptyObject | null
		useAuthorEmailPatterns: EmptyObject | null // TODO: Rule options for `useAuthorEmailPatterns`.
		useAuthorNamePatterns: EmptyObject | null // TODO: Rule options for `useAuthorNamePatterns`.
		useCapitalisedSubjectLines: EmptyObject | null
		useCommitterEmailPatterns: EmptyObject | null // TODO: Rule options for `useCommitterEmailPatterns`.
		useCommitterNamePatterns: EmptyObject | null // TODO: Rule options for `useCommitterNamePatterns`.
		useConciseSubjectLines: EmptyObject | null // TODO: Rule options for `useConciseSubjectLines`.
		useEmptyLineBeforeBodyLines: EmptyObject | null
		useImperativeSubjectLines: EmptyObject | null // TODO: Rule options for `useImperativeSubjectLines`.
		useIssueReferences: EmptyObject | null // TODO: Rule options for `useIssueReferences`.
		useLineWrapping: EmptyObject | null // TODO: Rule options for `useLineWrapping`.
	}
}

export type RuleKey = keyof Configuration["rules"]
