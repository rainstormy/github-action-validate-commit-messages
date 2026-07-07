import type { Commit, Commits } from "#commits/Commit.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
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

	switch (options.position) {
		case "anywhere": {
			for (const commit of commits) {
				yield* getCommitConcernsAnywhere(commit)
			}
			break
		}
		case "prefix": {
			for (const commit of commits) {
				yield* getCommitConcernsPrefix(commit)
			}
			break
		}
		case "suffix": {
			for (const commit of commits) {
				yield* getCommitConcernsSuffix(commit)
			}
			break
		}
	}
}

function* getCommitConcernsAnywhere(commit: Commit): Generator<Concern> {
	if (commit.isMergeCommit || hasIgnoredToken(commit.subjectLine)) {
		return
	}

	if (commit.subjectLine.some((token) => token.type === "issuelink")) {
		return
	}

	const firstSignificantIndex = getSquashPrefixEndIndex(commit.subjectLine) ?? 0
	yield subjectLineConcern(rule, commit.sha, {
		range: [firstSignificantIndex, firstSignificantIndex + 1],
	})
}

function* getCommitConcernsPrefix(commit: Commit): Generator<Concern> {
	if (commit.isMergeCommit || hasIgnoredToken(commit.subjectLine)) {
		return
	}

	const squashPrefixEndIndex = getSquashPrefixEndIndex(commit.subjectLine)
	const subjectLineAfterPrefix =
		squashPrefixEndIndex !== null
			? commit.subjectLine.filter((token) => token.range[0] >= squashPrefixEndIndex)
			: commit.subjectLine
	const firstSignificantToken = subjectLineAfterPrefix.find((token) => token.type !== "whitespace")

	if (firstSignificantToken?.type === "issuelink") {
		return
	}

	const firstSignificantIndex = squashPrefixEndIndex ?? 0
	yield subjectLineConcern(rule, commit.sha, {
		range: [firstSignificantIndex, firstSignificantIndex + 1],
	})
}

function* getCommitConcernsSuffix(commit: Commit): Generator<Concern> {
	if (commit.isMergeCommit || hasIgnoredToken(commit.subjectLine)) {
		return
	}

	const lastSignificantToken = commit.subjectLine.findLast((token) => token.type !== "whitespace")

	if (lastSignificantToken?.type === "issuelink") {
		return
	}

	const lastIndex = commit.subjectLine.at(-1)?.range[1] ?? 0
	yield subjectLineConcern(rule, commit.sha, { range: [lastIndex, lastIndex + 1] })
}

function hasIgnoredToken(subjectLine: TokenisedLine): boolean {
	return subjectLine.some((token) => token.type === "semver" || token.type === "revert")
}

function getSquashPrefixEndIndex(subjectLine: TokenisedLine): number | null {
	const firstSignificantTokenIndex = subjectLine.findIndex((token) => token.type !== "whitespace")
	const firstSignificantToken = subjectLine[firstSignificantTokenIndex]

	if (firstSignificantToken?.type !== "squash") {
		return null
	}

	let endIndex = firstSignificantToken.range[1]

	for (const token of subjectLine.slice(firstSignificantTokenIndex + 1)) {
		if (token.type !== "squash" && token.type !== "whitespace") {
			break
		}

		endIndex = token.range[1]
	}

	return endIndex
}
