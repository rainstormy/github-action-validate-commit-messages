import type { Commits } from "#commits/Commit.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import { regexUnion } from "#utilities/Regexes.ts"

/**
 * Verifies that the commit author has a name that matches a given regex pattern.
 *
 * Restricting author names to trusted patterns helps to keep the commit history attributable
 * and avoids leaks of private information (e.g. a personal username).
 */
export function* useAuthorNamePatterns(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "useAuthorNamePatterns"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	const patterns = configuration.options.patterns

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
