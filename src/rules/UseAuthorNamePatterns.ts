import * as v from "valibot"
import type { Commits } from "#commits/Commit.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { nonEmptyArray } from "#utilities/Arrays.ts"
import { regexUnion } from "#utilities/Regexes.ts"

const rule = "useAuthorNamePatterns" satisfies RuleKey

export type UseAuthorNamePatternsOptions = v.InferOutput<typeof USE_AUTHOR_NAME_PATTERNS_OPTIONS>

export const USE_AUTHOR_NAME_PATTERNS_OPTIONS = v.strictObject({
	patterns: nonEmptyArray(v.string()),
})

/**
 * Verifies that the commit author has a name that matches a given regex pattern.
 *
 * Restricting author names to trusted patterns helps to keep the commit history attributable
 * and avoids leaks of private information (e.g. a personal username).
 */
export function* useAuthorNamePatterns(
	commits: Commits,
	options: UseAuthorNamePatternsOptions | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	const patterns = options.patterns

	if (patterns.length === 0) {
		return
	}

	const regex = new RegExp(`^${regexUnion(patterns)}$`, "u")
	const field = { field: "author:name" } as const

	for (const commit of commits) {
		if (!regex.test(commit.authorName)) {
			yield userIdentityConcern(rule, commit.sha, field)
		}
	}
}
