import type { Commits } from "#commits/Commit.ts"
import { isNotToken, isToken, tokenRangeEnd } from "#commits/tokens/Token.ts"
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

	if (options.position === "anywhere") {
		for (const commit of commits) {
			if (
				commit.isMergeCommit ||
				commit.subjectLine.some(isToken("issuelink", "revert", "semver"))
			) {
				continue
			}

			const firstToken = commit.subjectLine.find(isNotToken("squash", "whitespace"))
			const firstStart = firstToken?.range[0] ?? tokenRangeEnd(commit.subjectLine)

			yield subjectLineConcern(rule, commit.sha, { range: [firstStart, firstStart + 1] })
		}

		return
	}

	if (options.position === "prefix") {
		for (const commit of commits) {
			if (commit.isMergeCommit || commit.subjectLine.some(isToken("revert", "semver"))) {
				continue
			}

			const firstToken = commit.subjectLine.find(isNotToken("squash", "whitespace"))

			if (firstToken?.type !== "issuelink") {
				const firstStart = firstToken?.range[0] ?? tokenRangeEnd(commit.subjectLine)
				yield subjectLineConcern(rule, commit.sha, { range: [firstStart, firstStart + 1] })
			}
		}

		return
	}

	for (const commit of commits) {
		if (commit.isMergeCommit || commit.subjectLine.some(isToken("revert", "semver"))) {
			continue
		}

		const lastToken = commit.subjectLine.findLast(isNotToken("whitespace"))

		if (lastToken?.type !== "issuelink") {
			const lastEnd = tokenRangeEnd(commit.subjectLine)
			yield subjectLineConcern(rule, commit.sha, { range: [lastEnd, lastEnd + 1] })
		}
	}
}
