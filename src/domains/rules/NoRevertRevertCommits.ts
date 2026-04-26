import type { Commit, Commits } from "#commits/Commit.ts"
import { trimmedTokenRange } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { type RuleContext, ruleContext } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

/**
 * Verifies that the subject line contains at most one revert marker.
 *
 * Cherry-picking the original commit provides more context, such as the original commit message and authorship.
 * This helps to preserve the traceability of the commit history.
 */
export function noRevertRevertCommits(commits: Commits, options: EmptyObject | null): Concerns {
	if (options === null) {
		return []
	}

	const rule = ruleContext("noRevertRevertCommits")
	return commits.map((commit) => verifyCommit(commit, rule)).filter(notNullish)
}

function verifyCommit(commit: Commit, rule: RuleContext): Concern | null {
	for (const token of commit.subjectLine) {
		if (token.type === "revert-marker" && token.occurrences > 1) {
			return subjectLineConcern(rule, commit.sha, {
				range: trimmedTokenRange(token),
			})
		}
	}

	return null
}
