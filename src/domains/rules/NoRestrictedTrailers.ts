import * as v from "valibot"
import type { Commits } from "#commits/Commit.ts"
import { isToken } from "#commits/Token.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { isNotEmptyString } from "#utilities/Arrays.ts"

const rule = "noRestrictedTrailers" satisfies RuleKey

export type NoRestrictedTrailersOptions = v.InferOutput<typeof NO_RESTRICTED_TRAILERS_OPTIONS>

export const NO_RESTRICTED_TRAILERS_OPTIONS = v.strictObject({
	restrictedKeys: v.array(v.string()),
})

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
	options: NoRestrictedTrailersOptions | null,
): Generator<Concern> {
	if (options === null || options.restrictedKeys.length === 0) {
		return
	}

	const restrictedKeys = new Set(
		options.restrictedKeys.map(normaliseTrailerKey).filter(isNotEmptyString),
	)

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
