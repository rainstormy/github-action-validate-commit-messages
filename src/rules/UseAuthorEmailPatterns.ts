import * as v from "valibot"
import type { Commits } from "#commits/Commit.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { nonEmptyArray } from "#utilities/Arrays.ts"
import { regexUnion } from "#utilities/Regexes.ts"

const rule = "useAuthorEmailPatterns" satisfies RuleKey

export type UseAuthorEmailPatternsOptions = v.InferOutput<typeof USE_AUTHOR_EMAIL_PATTERNS_OPTIONS>

export const USE_AUTHOR_EMAIL_PATTERNS_OPTIONS = v.strictObject({
	patterns: nonEmptyArray(v.string()),
})

/**
 * Verifies that the commit author has an email address that matches a given regex pattern.
 *
 * Restricting author email addresses to trusted patterns helps to keep the commit history attributable
 * and avoids leaks of private information (e.g. a personal email address).
 */
export function* useAuthorEmailPatterns(
	commits: Commits,
	options: UseAuthorEmailPatternsOptions | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	const patterns = options.patterns

	if (patterns.length === 0) {
		return
	}

	const regex = new RegExp(`^${regexUnion(patterns)}$`, "u")
	const field = { field: "author:email" } as const

	for (const commit of commits) {
		if (!regex.test(commit.authorEmail)) {
			yield userIdentityConcern(rule, commit.sha, field)
		}
	}
}
