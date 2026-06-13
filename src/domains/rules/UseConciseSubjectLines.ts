import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"

const rule = "useConciseSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line does not exceed a given number of characters (default: 50 characters).
 *
 * Keeping the subject line short helps to preserve the readability of the commit history in various Git clients.
 *
 * It ignores merge commits, revert commits, and dependency upgrade commits.
 * Issue links, inline code phrases, and squash markers do not count towards the limit.
 */
export function* useConciseSubjectLines(
	commits: Commits,
	options: { maxLength: number } | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		yield* getCommitConcerns(commit, options.maxLength)
	}
}

function* getCommitConcerns(commit: Commit, maxLength: number): Generator<Concern> {
	if (commit.isMergeCommit) {
		return
	}

	let textLength = 0
	let overflowStartIndex = 0
	let overflowEndIndex = 0

	for (const token of commit.subjectLine) {
		if (token.type === "dependency-version" || token.type === "revert-marker") {
			return
		}
		if (token.type === "text") {
			textLength += token.value.length

			if (textLength > maxLength) {
				if (overflowStartIndex === 0) {
					const offset = maxLength - textLength + token.value.length
					overflowStartIndex = token.range[0] + offset
				}
				overflowEndIndex = token.range[1]
			}
		}
	}

	if (overflowEndIndex !== overflowStartIndex) {
		yield subjectLineConcern(rule, commit.sha, { range: [overflowStartIndex, overflowEndIndex] })
	}
}
