import * as v from "valibot"
import type { Commits } from "#commits/Commit.ts"
import { isNotToken, isToken, tokenOverflowRange } from "#commits/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { naturalNumber } from "#types/NaturalNumber.ts"

const rule = "useConciseSubjectLines" satisfies RuleKey

export type UseConciseSubjectLinesOptions = v.InferOutput<typeof USE_CONCISE_SUBJECT_LINES_OPTIONS>

export const USE_CONCISE_SUBJECT_LINES_OPTIONS = v.strictObject({
	maxLength: naturalNumber(),
})

/**
 * Verifies that the subject line does not exceed a given number of characters (default: 50 characters).
 *
 * Keeping the subject line short helps to preserve the readability of the commit history in various Git clients.
 *
 * It ignores merge commits, revert commits, squash commits, and dependency upgrade commits.
 * Hyperlinks, issue links, and inline code phrases do not count towards the limit.
 */
export function* useConciseSubjectLines(
	commits: Commits,
	options: UseConciseSubjectLinesOptions | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		if (commit.isMergeCommit || commit.subjectLine.some(isToken("revert", "semver", "squash"))) {
			continue
		}

		const overflowRange = tokenOverflowRange(
			commit.subjectLine.filter(isNotToken("code", "hyperlink", "issuelink")),
			options.maxLength,
		)

		if (overflowRange !== null) {
			yield subjectLineConcern(rule, commit.sha, { range: overflowRange })
		}
	}
}
