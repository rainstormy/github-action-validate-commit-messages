import type { Commit, Commits } from "#commits/Commit.ts"
import type { Token } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import { notNullish } from "#utilities/Arrays.ts"

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
export function useIssueLinks(
	commits: Commits,
	options: { position: "anywhere" | "prefix" | "suffix" } | null,
): Concerns {
	return options !== null
		? commits.map((commit) => verifyCommit(commit, options)).filter(notNullish)
		: []
}

function verifyCommit(commit: Commit, options: RuleOptions<typeof rule>): Concern | null {
	if (commit.isMergeCommit) {
		return null
	}

	switch (options.position) {
		case "anywhere": {
			return verifyAnywhere(commit)
		}
		case "prefix": {
			return verifyPrefix(commit)
		}
		case "suffix": {
			return verifySuffix(commit)
		}
	}
}

function verifyAnywhere(commit: Commit): Concern | null {
	let lastInsignificantToken: Token | null = null

	for (const token of commit.subjectLine) {
		if (
			token.type === "dependency-version" ||
			token.type === "issue-link" ||
			token.type === "revert-marker"
		) {
			return null
		}
		if (token.type === "squash-marker") {
			lastInsignificantToken = token
		}
	}

	const firstSignificantIndex = lastInsignificantToken?.range[1] ?? 0

	return subjectLineConcern(rule, commit.sha, {
		range: [firstSignificantIndex, firstSignificantIndex + 1],
	})
}

function verifyPrefix(commit: Commit): Concern | null {
	let firstSignificantToken: Token | null = null
	let lastInsignificantToken: Token | null = null

	for (const token of commit.subjectLine) {
		if (token.type === "dependency-version" || token.type === "revert-marker") {
			return null
		}
		if (firstSignificantToken === null) {
			if (token.type === "issue-link") {
				return null
			}
			if (token.type !== "squash-marker") {
				firstSignificantToken = token
			} else {
				lastInsignificantToken = token
			}
		}
	}

	const firstSignificantIndex = lastInsignificantToken?.range[1] ?? 0

	return subjectLineConcern(rule, commit.sha, {
		range: [firstSignificantIndex, firstSignificantIndex + 1],
	})
}

function verifySuffix(commit: Commit): Concern | null {
	for (const token of commit.subjectLine) {
		if (token.type === "dependency-version" || token.type === "revert-marker") {
			return null
		}
	}

	const lastToken = commit.subjectLine.at(-1)

	if (lastToken?.type === "issue-link") {
		return null
	}

	const lastIndex = lastToken?.range[1] ?? 0
	return subjectLineConcern(rule, commit.sha, { range: [lastIndex, lastIndex + 1] })
}
