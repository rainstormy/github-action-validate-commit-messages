import type { Commit, CommitRefiner } from "+rules"

export const ruleKeys = [
	"acknowledged-author-email-addresses",
	"acknowledged-author-names",
	"acknowledged-committer-email-addresses",
	"acknowledged-committer-names",
	"capitalised-subject-lines",
	"empty-line-after-subject-lines",
	"imperative-subject-lines",
	"issue-references-in-subject-lines",
	"limit-length-of-body-lines",
	"limit-length-of-subject-lines",
	"multi-word-subject-lines",
	"no-co-authors",
	"no-merge-commits",
	"no-revert-revert-commits",
	"no-squash-commits",
	"no-trailing-punctuation-in-subject-lines",
	"no-unexpected-whitespace",
] as const

export type RuleKey = (typeof ruleKeys)[number]

export type Rule = {
	readonly key: RuleKey
	readonly refine?: CommitRefiner
	readonly getInvalidCommits: (
		refinedCommits: ReadonlyArray<Commit>,
	) => ReadonlyArray<Commit>
}
