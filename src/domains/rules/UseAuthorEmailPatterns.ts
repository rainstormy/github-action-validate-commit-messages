import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { type NonEmptyArray, notNullish } from "#utilities/Arrays.ts"
import { regexUnion } from "#utilities/Regexes.ts"

const rule = "useAuthorEmailPatterns" satisfies RuleKey

/**
 * Verifies that the commit author has an email address that matches a given regex pattern.
 *
 * Restricting author email addresses to trusted patterns helps to keep the commit history attributable
 * and avoids leaks of private information (e.g. a personal email address).
 */
export function useAuthorEmailPatterns(
	commits: Commits,
	options: { patterns: NonEmptyArray<string> } | null,
): Concerns {
	if (options === null) {
		return []
	}

	const combinedRegex = new RegExp(`^${regexUnion(options.patterns)}$`, "u")
	return commits.map((commit) => verifyCommit(commit, combinedRegex)).filter(notNullish)
}

function verifyCommit(commit: Commit, regex: RegExp): Concern | null {
	return regex.test(commit.authorEmail)
		? null
		: userIdentityConcern(rule, commit.sha, { field: "author:email" })
}
