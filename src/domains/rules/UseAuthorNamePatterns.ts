import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

const _rule = "useAuthorNamePatterns" satisfies RuleKey

export function useAuthorNamePatterns(commits: Commits, options: EmptyObject | null): Concerns {
	return options !== null
		? commits.map((commit) => verifyCommit(commit, options)).filter(notNullish)
		: []
}

function verifyCommit(_commit: Commit, _options: RuleOptions<typeof _rule>): Concern | null {
	throw new Error("The `useAuthorNamePatterns` rule has not been implemented yet") // TODO: To be implemented.
}
