import type { Commits } from "#commits/Commit.ts"
import { isToken } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { rangeBetween } from "#types/CharacterRange.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noSquashMarkers" satisfies RuleKey

/**
 * Verifies that the subject line does not contain any squash marker.
 *
 * Combining squash commits with their ancestors makes the commit history cleaner and easier to read,
 * as it omits unnecessary diffs and increases the cohesion of commits. It also makes it easier to revert changes later.
 */
export function* noSquashMarkers(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		const firstSquashToken = commit.subjectLine.find(isToken("squash"))

		if (firstSquashToken) {
			const lastSquashToken = commit.subjectLine.findLast(isToken("squash")) ?? firstSquashToken

			yield subjectLineConcern(rule, commit.sha, {
				range: rangeBetween(firstSquashToken.range, lastSquashToken.range),
			})
		}
	}
}
