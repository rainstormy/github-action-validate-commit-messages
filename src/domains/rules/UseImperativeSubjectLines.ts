import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { type RuleContext, ruleContext } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

export function useImperativeSubjectLines(commits: Commits, options: EmptyObject | null): Concerns {
	if (options === null) {
		return []
	}

	const rule = ruleContext("useImperativeSubjectLines")
	return commits.map((commit) => verifyCommit(commit, rule)).filter(notNullish)
}

function verifyCommit(_commit: Commit, _rule: RuleContext): Concern | null {
	throw new Error("The `useImperativeSubjectLines` rule has not been implemented yet") // TODO: To be implemented.
}
