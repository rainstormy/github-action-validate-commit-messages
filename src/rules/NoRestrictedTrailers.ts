import type { Commits } from "#commits/Commit.ts"
import { isToken } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { isNotEmptyString } from "#utilities/Arrays.ts"

/**
 * Verifies that the message body does not contain trailers with certain keys.
 *
 * For example, disallowing `Co-authored-by` trailers helps to keep the commit history attributable,
 * as co-authors are unable to sign commits. It also rejects commits made from code review suggestions through the GitHub web interface.
 *
 * It is case-insensitive.
 */
export function* noRestrictedTrailers(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "noRestrictedTrailers"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	const restrictedKeys = new Set(
		configuration.options.restrictedKeys.map(normaliseTrailerKey).filter(isNotEmptyString),
	)

	if (restrictedKeys.size === 0) {
		return
	}

	for (const commit of commits) {
		for (const [lineNumber, bodyLine] of commit.bodyLines.entries()) {
			const key = bodyLine.find(isToken("trailerkey")) ?? null

			if (key !== null && restrictedKeys.has(key.value.toLowerCase())) {
				yield bodyLineConcern(rule, commit.sha, { line: lineNumber, range: key.range })
			}
		}
	}
}

export function normaliseTrailerKey(key: string): string {
	const trimmedKey = key.trim().toLowerCase()
	return trimmedKey.endsWith(":") ? trimmedKey.slice(0, -":".length).trimEnd() : trimmedKey
}
