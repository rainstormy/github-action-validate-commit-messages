import type { Commit, Commits } from "#commits/Commit.ts"
import type { Token, TokenisedLine } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"

const rule = "useConciseSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line does not exceed a given number of characters (default: 50 characters).
 *
 * Keeping the subject line short helps to preserve the readability of the commit history in various Git clients.
 *
 * It ignores merge commits, revert commits, and dependency upgrade commits.
 * Issue links, inline code phrases, and squash markers do not count towards the limit.
 */
export function* useConciseSubjectLines(
	commits: Commits,
	options: { maxLength: number } | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		yield* getCommitConcerns(commit, options.maxLength)
	}
}

function* getCommitConcerns(commit: Commit, maxLength: number): Generator<Concern> {
	if (commit.isMergeCommit) {
		return
	}

	let textLength = 0
	let overflowStartIndex = 0
	let overflowEndIndex = 0

	for (const [index, token] of commit.subjectLine.entries()) {
		if (token.type === "dependency-version" || token.type === "revert-marker") {
			return
		}
		if (isCountedToken(commit.subjectLine, token, index)) {
			textLength += token.value.length

			if (textLength > maxLength) {
				if (overflowStartIndex === 0) {
					const offset = maxLength - textLength + token.value.length
					overflowStartIndex = token.range[0] + offset
				}
				overflowEndIndex = token.range[1]
			}
		}
	}

	if (overflowEndIndex !== overflowStartIndex) {
		yield subjectLineConcern(rule, commit.sha, { range: [overflowStartIndex, overflowEndIndex] })
	}
}

function isCountedToken(subjectLine: TokenisedLine, token: Token, index: number): boolean {
	if (token.type !== "punctuation" && token.type !== "whitespace" && token.type !== "word") {
		return false
	}

	return !isInLeadingSquashPrefix(subjectLine, index) && !isIssueLinkWhitespace(subjectLine, index)
}

function isInLeadingSquashPrefix(subjectLine: TokenisedLine, index: number): boolean {
	const firstSignificantTokenIndex = subjectLine.findIndex((token) => token.type !== "whitespace")
	const firstSignificantToken = subjectLine[firstSignificantTokenIndex]

	if (firstSignificantToken?.type !== "squash-marker" || index < firstSignificantTokenIndex) {
		return false
	}

	return subjectLine
		.slice(firstSignificantTokenIndex, index + 1)
		.every((token) => token.type === "squash-marker" || token.type === "whitespace")
}

function isIssueLinkWhitespace(subjectLine: TokenisedLine, index: number): boolean {
	const token = subjectLine[index]

	if (token?.type !== "whitespace") {
		return false
	}

	const previousSignificantToken = subjectLine
		.slice(0, index)
		.findLast((candidate) => candidate.type !== "whitespace")
	const nextSignificantToken = subjectLine
		.slice(index + 1)
		.find((candidate) => candidate.type !== "whitespace")

	return (
		previousSignificantToken?.type === "issue-link" || nextSignificantToken?.type === "issue-link"
	)
}
