import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

const _rule = "noRepeatedSubjectLines" satisfies RuleKey

export function noRepeatedSubjectLines(commits: Commits, options: EmptyObject | null): Concerns {
	return options !== null ? commits.map(verifyCommit).filter(notNullish) : []
}

function verifyCommit(_commit: Commit): Concern | null {
	throw new Error("The `noRepeatedSubjectLines` rule has not been implemented yet") // TODO: To be implemented.
}
