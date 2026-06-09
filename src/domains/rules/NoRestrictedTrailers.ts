import type { Commit, Commits } from "#commits/Commit.ts"
import { type TrailerToken, trimmedTrailerTokenKeyRange } from "#commits/tokens/TrailerToken.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"

const rule = "noRestrictedTrailers" satisfies RuleKey

/**
 * Verifies that the message body does not contain trailers with certain keys.
 *
 * For example, disallowing `Co-authored-by` trailers helps to keep the commit history attributable,
 * as co-authors are unable to sign commits. It also rejects commits made from code review suggestions through the GitHub web interface.
 */
export function noRestrictedTrailers(
	commits: Commits,
	options: { restrictedKeys: Array<string> } | null,
): Concerns {
	if (options === null || options.restrictedKeys.length === 0) {
		return []
	}

	const restrictedKeys = new Set(options.restrictedKeys.map(normaliseTrailerKey))
	return commits.flatMap((commit) => verifyCommit(commit, restrictedKeys))
}

function verifyCommit(commit: Commit, restrictedKeys: Set<string>): Concerns {
	const concerns: Concerns = []

	let line = 0

	for (const bodyLine of commit.bodyLines) {
		const [firstToken] = bodyLine

		if (firstToken?.type === "trailer" && isRestrictedTrailer(firstToken, restrictedKeys)) {
			const range = trimmedTrailerTokenKeyRange(firstToken)
			concerns.push(bodyLineConcern(rule, commit.sha, { line, range }))
		}

		line += 1
	}

	return concerns
}

function isRestrictedTrailer(trailer: TrailerToken, restrictedKeys: Set<string>): boolean {
	return restrictedKeys.has(normaliseTrailerKey(trailer.key))
}

export function normaliseTrailerKey(key: string): string {
	const trimmedKey = key.trim().toLowerCase()
	return trimmedKey.endsWith(":") ? trimmedKey.slice(0, -":".length).trimEnd() : trimmedKey
}
