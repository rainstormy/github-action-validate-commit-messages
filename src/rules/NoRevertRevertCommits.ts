import type { Commits } from "#commits/Commit.ts"
import { isToken } from "#commits/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { rangeBetween } from "#types/CharacterRange.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noRevertRevertCommits" satisfies RuleKey

/**
 * Verifies that the subject line contains at most one revert marker.
 *
 * Cherry-picking the original commit provides more context, such as the original commit message and authorship.
 * This helps to preserve the traceability of the commit history.
 */
export function* noRevertRevertCommits(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		const firstRevertToken = commit.subjectLine.find(isToken("revert"))
		const lastRevertToken = commit.subjectLine.findLast(isToken("revert"))

		if (firstRevertToken && lastRevertToken && firstRevertToken !== lastRevertToken) {
			yield subjectLineConcern(rule, commit.sha, {
				range: rangeBetween(firstRevertToken.range, lastRevertToken.range),
			})
		}
	}
}
