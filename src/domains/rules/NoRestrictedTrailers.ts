import type { Commits } from "#commits/Commit.ts"
import { isToken } from "#commits/Token.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { notEmptyString } from "#utilities/Arrays.ts"

const rule = "noRestrictedTrailers" satisfies RuleKey

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
	options: { restrictedKeys: Array<string> } | null,
): Generator<Concern> {
	if (options === null || options.restrictedKeys.length === 0) {
		return
	}

	const restrictedKeys = new Set(
		options.restrictedKeys.map(normaliseTrailerKey).filter(notEmptyString),
	)

	for (const commit of commits) {
		let line = 0

		for (const bodyLine of commit.bodyLines) {
			const key = bodyLine.find(isToken("trailerkey")) ?? null

			if (key !== null && restrictedKeys.has(key.value.toLowerCase())) {
				yield bodyLineConcern(rule, commit.sha, { line, range: key.range })
			}

			line += 1
		}
	}
}

export function normaliseTrailerKey(key: string): string {
	const trimmedKey = key.trim().toLowerCase()
	return trimmedKey.endsWith(":") ? trimmedKey.slice(0, -":".length).trimEnd() : trimmedKey
}
