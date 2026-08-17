import type { Commits } from "#commits/Commit.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"

/**
 * Verifies that the commit has been signed cryptographically with a signing key.
 *
 * Signing commits protects authors from impersonation and helps to keep the commit history attributable.
 */
export function* useSignedCommits(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "useSignedCommits"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	for (const commit of commits) {
		if (!commit.hasSignature) {
			yield commitConcern(rule, commit.sha)
		}
	}
}
