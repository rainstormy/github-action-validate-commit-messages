import type { Commit, Commits } from "#commits/Commit.ts"
import { trimmedTokenRange } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

const rule = "noSquashMarkers" satisfies RuleKey

/**
 * Verifies that the subject line does not contain any squash marker.
 *
 * Combining squash commits with their ancestors makes the commit history cleaner and easier to read,
 * as it omits unnecessary diffs and increases the cohesion of commits. It also makes it easier to revert changes later.
 */
export function noSquashMarkers(commits: Commits, options: EmptyObject | null): Concerns {
	return options !== null ? commits.map(verifyCommit).filter(notNullish) : []
}

function verifyCommit(commit: Commit): Concern | null {
	const [firstToken] = commit.subjectLine

	return firstToken?.type === "squash-marker"
		? subjectLineConcern(rule, commit.sha, { range: trimmedTokenRange(firstToken) })
		: null
}
