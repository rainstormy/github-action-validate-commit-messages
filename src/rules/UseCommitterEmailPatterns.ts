import * as v from "valibot"
import type { Commits } from "#commits/Commit.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { nonEmptyArray } from "#utilities/Arrays.ts"
import { regexUnion } from "#utilities/Regexes.ts"

const rule = "useCommitterEmailPatterns" satisfies RuleKey

export type UseCommitterEmailPatternsOptions = v.InferOutput<
	typeof USE_COMMITTER_EMAIL_PATTERNS_OPTIONS
>

export const USE_COMMITTER_EMAIL_PATTERNS_OPTIONS = v.strictObject({
	patterns: nonEmptyArray(v.string()),
})

/**
 * Verifies that the committer has an email address that matches a given regex pattern.
 *
 * Restricting committer email addresses to trusted patterns helps to keep the commit history attributable
 * and avoids leaks of private information (e.g. a personal email address).
 */
export function* useCommitterEmailPatterns(
	commits: Commits,
	options: UseCommitterEmailPatternsOptions | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	const patterns = options.patterns

	if (patterns.length === 0) {
		return
	}

	const regex = new RegExp(`^${regexUnion(patterns)}$`, "u")
	const field = { field: "committer:email" } as const

	for (const commit of commits) {
		if (!regex.test(commit.committerEmail)) {
			yield userIdentityConcern(rule, commit.sha, field)
		}
	}
}
