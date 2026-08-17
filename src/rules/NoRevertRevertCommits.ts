import type { Commits } from "#commits/Commit.ts"
import { isToken } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { rangeBetween } from "#types/CharacterRange.ts"

/**
 * Verifies that the subject line contains at most one revert marker.
 *
 * Cherry-picking the original commit provides more context, such as the original commit message and authorship.
 * This helps to preserve the traceability of the commit history.
 */
export function* noRevertRevertCommits(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "noRevertRevertCommits"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
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
