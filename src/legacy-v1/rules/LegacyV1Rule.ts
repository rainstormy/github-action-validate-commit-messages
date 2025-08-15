import type { LegacyV1Commit } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1CommitRefiner } from "#legacy-v1/rules/LegacyV1CommitRefiner"

export const legacyV1RuleKeys = [
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
	"unique-subject-lines",
] as const

export type LegacyV1RuleKey = (typeof legacyV1RuleKeys)[number]
export type LegacyV1RuleKeys = ReadonlyArray<LegacyV1RuleKey>

export type LegacyV1Rule = {
	readonly key: LegacyV1RuleKey
	readonly refine?: LegacyV1CommitRefiner
	readonly getInvalidCommits: (
		refinedCommits: ReadonlyArray<LegacyV1Commit>,
	) => ReadonlyArray<LegacyV1Commit>
}
