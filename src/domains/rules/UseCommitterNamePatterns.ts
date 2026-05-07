import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { type NonEmptyArray, notNullish } from "#utilities/Arrays.ts"

const rule = "useCommitterNamePatterns" satisfies RuleKey

/**
 * Verifies that the committer has a name that matches a given regex pattern.
 *
 * Restricting committer names to trusted patterns helps to keep the commit history attributable
 * and avoids leaks of private information (e.g. a personal username).
 */
export function useCommitterNamePatterns(
	commits: Commits,
	options: { patterns: NonEmptyArray<string> } | null,
): Concerns {
	if (options === null) {
		return []
	}

	const combinedPatterns = options.patterns.map((pattern) => `(?:${pattern})`).join("|")
	const combinedRegex = new RegExp(`^${combinedPatterns}$`, "u")

	return commits.map((commit) => verifyCommit(commit, combinedRegex)).filter(notNullish)
}

function verifyCommit(commit: Commit, regex: RegExp): Concern | null {
	return regex.test(commit.committerName)
		? null
		: userIdentityConcern(rule, commit.sha, { field: "committer:name" })
}
