import type { Commit, Commits } from "#commits/Commit.ts"
import type { Token } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"

const rule = "useIssueLinks" satisfies RuleKey

/**
 * Verifies that the subject line contains at least one issue link.
 *
 * Linking commits to issues in a project management system like GitHub or Jira
 * provides traceability between code changes and the work that motivated them,
 * making it easier to understand the project history and to find related changes.
 *
 * It ignores merge commits, revert commits, and dependency upgrade commits.
 * It disregards squash markers when the position is `prefix`.
 */
export function* useIssueLinks(
	commits: Commits,
	options: { position: "anywhere" | "prefix" | "suffix" } | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		if (commit.isMergeCommit) {
			return
		}

		switch (options.position) {
			case "anywhere": {
				yield* getCommitConcernsAnywhere(commit)
				break
			}
			case "prefix": {
				yield* getCommitConcernsPrefix(commit)
				break
			}
			case "suffix": {
				yield* getCommitConcernsSuffix(commit)
				break
			}
		}
	}
}

function* getCommitConcernsAnywhere(commit: Commit): Generator<Concern> {
	let lastInsignificantToken: Token | null = null

	for (const token of commit.subjectLine) {
		if (
			token.type === "dependency-version" ||
			token.type === "issue-link" ||
			token.type === "revert-marker"
		) {
			return
		}
		if (token.type === "squash-marker") {
			lastInsignificantToken = token
		}
	}

	const firstSignificantIndex = lastInsignificantToken?.range[1] ?? 0

	yield subjectLineConcern(rule, commit.sha, {
		range: [firstSignificantIndex, firstSignificantIndex + 1],
	})
}

function* getCommitConcernsPrefix(commit: Commit): Generator<Concern> {
	let firstSignificantToken: Token | null = null
	let lastInsignificantToken: Token | null = null

	for (const token of commit.subjectLine) {
		if (token.type === "dependency-version" || token.type === "revert-marker") {
			return
		}
		if (firstSignificantToken === null) {
			if (token.type === "issue-link") {
				return
			}
			if (token.type !== "squash-marker") {
				firstSignificantToken = token
			} else {
				lastInsignificantToken = token
			}
		}
	}

	const firstSignificantIndex = lastInsignificantToken?.range[1] ?? 0

	yield subjectLineConcern(rule, commit.sha, {
		range: [firstSignificantIndex, firstSignificantIndex + 1],
	})
}

function* getCommitConcernsSuffix(commit: Commit): Generator<Concern> {
	for (const token of commit.subjectLine) {
		if (token.type === "dependency-version" || token.type === "revert-marker") {
			return
		}
	}

	const lastToken = commit.subjectLine.at(-1)

	if (lastToken?.type === "issue-link") {
		return
	}

	const lastIndex = lastToken?.range[1] ?? 0
	yield subjectLineConcern(rule, commit.sha, { range: [lastIndex, lastIndex + 1] })
}
