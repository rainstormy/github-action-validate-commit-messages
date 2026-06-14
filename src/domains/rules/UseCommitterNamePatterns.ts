import type { Commits } from "#commits/Commit.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { NonEmptyArray } from "#utilities/Arrays.ts"
import { regexUnion } from "#utilities/Regexes.ts"

const rule = "useCommitterNamePatterns" satisfies RuleKey

/**
 * Verifies that the committer has a name that matches a given regex pattern.
 *
 * Restricting committer names to trusted patterns helps to keep the commit history attributable
 * and avoids leaks of private information (e.g. a personal username).
 */
export function* useCommitterNamePatterns(
	commits: Commits,
	options: { patterns: NonEmptyArray<string> } | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	const regex = new RegExp(`^${regexUnion(options.patterns)}$`, "u")
	const field = { field: "committer:name" } as const

	for (const commit of commits) {
		if (!regex.test(commit.committerName)) {
			yield userIdentityConcern(rule, commit.sha, field)
		}
	}
}
