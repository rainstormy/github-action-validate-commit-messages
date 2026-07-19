import type { Commits } from "#commits/Commit.ts"
import { isNotToken, isToken } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"

const rule = "useConciseSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line does not exceed a given number of characters (default: 50 characters).
 *
 * Keeping the subject line short helps to preserve the readability of the commit history in various Git clients.
 *
 * It ignores merge commits, revert commits, squash commits, and dependency upgrade commits.
 * Issue links and inline code phrases do not count towards the limit.
 */
export function* useConciseSubjectLines(
	commits: Commits,
	options: { maxLength: number } | null,
): Generator<Concern> {
	if (options === null || options.maxLength < 1) {
		return
	}

	const maxLength = Math.trunc(options.maxLength)

	for (const commit of commits) {
		if (commit.isMergeCommit || commit.subjectLine.some(isToken("revert", "semver", "squash"))) {
			continue
		}

		let textLength = 0
		let overflowStartIndex = 0
		let overflowEndIndex = 0

		const tokens = commit.subjectLine.filter(isNotToken("code", "issuelink"))

		for (const token of tokens) {
			textLength += token.value.length

			if (textLength > maxLength) {
				if (overflowStartIndex === 0) {
					const offset = maxLength - textLength + token.value.length
					overflowStartIndex = token.range[0] + offset
				}
				overflowEndIndex = token.range[1]
			}
		}

		if (overflowEndIndex !== overflowStartIndex) {
			yield subjectLineConcern(rule, commit.sha, {
				range: [overflowStartIndex, overflowEndIndex],
			})
		}
	}
}
