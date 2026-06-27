import type { Commit, Commits } from "#commits/Commit.ts"
import type { Token } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noBlankSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line contains at least one non-whitespace character.
 *
 * Including a subject line makes the commit distinguishable from other commits.
 * This helps to preserve the readability of the commit history.
 *
 * Issue links, revert markers, and squash markers do not count as non-whitespace characters.
 */
export function* noBlankSubjectLines(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		yield* getCommitConcerns(commit)
	}
}

function* getCommitConcerns(commit: Commit): Generator<Concern> {
	let lastInsignificantToken: Token | null = null

	for (const token of commit.subjectLine) {
		if (
			token.type === "dependency-version" ||
			token.type === "inline-code" ||
			token.type === "punctuation" ||
			token.type === "word"
		) {
			return
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

	yield subjectLineConcern(rule, commit.sha, { range: [firstBlankIndex, firstBlankIndex + 1] })
}
