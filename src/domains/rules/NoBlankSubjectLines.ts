import type { Commit, Commits } from "#commits/Commit.ts"
import type { Token } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

const rule = "noBlankSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line contains at least one non-whitespace character.
 *
 * Including a subject line makes the commit distinguishable from other commits.
 * This helps to preserve the readability of the commit history.
 *
 * Issue links, revert markers, and squash markers do not count as non-whitespace characters.
 */
export function noBlankSubjectLines(commits: Commits, options: EmptyObject | null): Concerns {
	return options !== null ? commits.map(verifyCommit).filter(notNullish) : []
}

function verifyCommit(commit: Commit): Concern | null {
	let lastInsignificantToken: Token | null = null

	for (const token of commit.subjectLine) {
		if (
			token.type === "dependency-version" ||
			token.type === "inline-code" ||
			(token.type === "text" && token.value.trim().length > 0)
		) {
			return null
		}
		if (
			token.type === "issue-link" ||
			(token.type === "revert-marker" && token.occurrences > 0) ||
			token.type === "squash-marker"
		) {
			lastInsignificantToken = token
		}
	}

	const firstBlankIndex =
		lastInsignificantToken !== null
			? lastInsignificantToken.range[0] + lastInsignificantToken.value.trimEnd().length
			: 0

	return subjectLineConcern(rule, commit.sha, { range: [firstBlankIndex, firstBlankIndex + 1] })
}
