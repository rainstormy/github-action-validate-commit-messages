import type { Commits } from "#commits/Commit.ts"
import { isNotToken, isToken } from "#commits/Token.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noRepeatedSubjectLines" satisfies RuleKey

/**
 * Verifies that each commit has a unique subject line within the branch.
 *
 * Commits that repeat a subject line are probably meant to be squash commits or the author may have forgotten to update the subject line.
 * Rewording commits or combining squash commits with their ancestors makes the commit history cleaner and easier to read.
 *
 * It is whitespace- and case-insensitive.
 * It ignores merge commits, revert commits, and commits with squash markers.
 */
export function* noRepeatedSubjectLines(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	const previousSubjectLines = new Set<string>()

	for (const commit of commits) {
		if (commit.subjectLine.some(isToken("revert", "squash"))) {
			continue
		}

		const canonicalSubjectLine = commit.subjectLine
			.filter(isNotToken("whitespace"))
			.map((token) => token.value)
			.join("")
			.toLowerCase()

		if (previousSubjectLines.has(canonicalSubjectLine) && !commit.isMergeCommit) {
			yield commitConcern(rule, commit.sha)
		}

		previousSubjectLines.add(canonicalSubjectLine)
	}
}
