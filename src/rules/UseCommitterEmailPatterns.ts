import type { Commits } from "#commits/Commit.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import { regexUnion } from "#utilities/Regexes.ts"

/**
 * Verifies that the committer has an email address that matches a given regex pattern.
 *
 * Restricting committer email addresses to trusted patterns helps to keep the commit history attributable
 * and avoids leaks of private information (e.g. a personal email address).
 */
export function* useCommitterEmailPatterns(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "useCommitterEmailPatterns"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	const patterns = configuration.options.patterns

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
