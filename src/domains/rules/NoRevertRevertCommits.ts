import type { Commit, Commits } from "#commits/Commit.ts"
import { trimmedTokenRange } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
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
		yield* getCommitConcerns(commit)
	}
}

function* getCommitConcerns(commit: Commit): Generator<Concern> {
	for (const token of commit.subjectLine) {
		if (token.type === "revert-marker" && token.occurrences > 1) {
			yield subjectLineConcern(rule, commit.sha, { range: trimmedTokenRange(token) })
			return
		}
	}
}
