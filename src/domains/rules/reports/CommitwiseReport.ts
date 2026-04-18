import type { Commit, Commits } from "#commits/Commit.ts"
import { formatTokenisedLine } from "#commits/tokens/Token.ts"
import type { CommitConcern } from "#rules/concerns/CommitConcern.ts"
import { type Concern, type Concerns, concernedCommit } from "#rules/concerns/Concern.ts"
import type { SubjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleContext } from "#rules/Rule.ts"
import { formatCharacterRange } from "#types/CharacterRange.ts"
import { indentString } from "#utilities/Strings.ts"

export function commitwiseReport(commits: Commits, concerns: Concerns): string {
	return concerns
		.map((concern) => formatConcern(concern, concernedCommit(concern, commits)))
		.join("\n\n")
}

function formatConcern(concern: Concern, commit: Commit): string {
	switch (concern.location) {
		case "author-email-address": {
			throw new Error(`Not implemented yet: ${concern.location}`)
		}
		case "author-name": {
			throw new Error(`Not implemented yet: ${concern.location}`)
		}
		case "body-line": {
			throw new Error(`Not implemented yet: ${concern.location}`)
		}
		case "commit": {
			return formatCommitConcern(concern, commit)
		}
		case "committer-email-address": {
			throw new Error(`Not implemented yet: ${concern.location}`)
		}
		case "committer-name": {
			throw new Error(`Not implemented yet: ${concern.location}`)
		}
		case "subject-line": {
			return formatSubjectLineConcern(concern, commit)
		}
	}
}

const SHORT_SHA_LENGTH = 7

const RANGE_PREFIX = "╭─"
const MESSAGE_PREFIX = "╰─"
const MESSAGE_SUFFIX = "─╯"

function formatCommitConcern(concern: CommitConcern, commit: Commit): string {
	const formattedSubjectLine = formatTokenisedLine(commit.subjectLine)
	const commitLine = `${commit.sha.slice(0, SHORT_SHA_LENGTH)} ${formattedSubjectLine}`
	const message = ruleMessage(concern.rule)

	const rangeLine = indentString(
		RANGE_PREFIX + "─".repeat(formattedSubjectLine.length),
		SHORT_SHA_LENGTH - RANGE_PREFIX.length + 1,
	)

	const messageLine = indentString(
		`${MESSAGE_PREFIX} ${message}\n   (${concern.rule.key})`,
		SHORT_SHA_LENGTH - MESSAGE_PREFIX.length + 1,
	)

	return `${commitLine}\n${rangeLine}\n${messageLine}`
}

function formatSubjectLineConcern(concern: SubjectLineConcern, commit: Commit): string {
	const commitLine = `${commit.sha.slice(0, SHORT_SHA_LENGTH)} ${formatTokenisedLine(commit.subjectLine)}`

	const [rangeStart, rangeEnd] = concern.range
	const length = rangeEnd - rangeStart

	const offset = SHORT_SHA_LENGTH + " ".length + rangeStart
	const longHalfLength = Math.trunc(length / 2)
	const shortHalfLength = length - longHalfLength - 1

	const message = ruleMessage(concern.rule)
	const anchoredRight = message.length + MESSAGE_SUFFIX.length < offset + longHalfLength

	const rangeLine = indentString(formatCharacterRange(concern.range, anchoredRight), offset)

	const messageLine = anchoredRight
		? indentString(
				`${message} ${MESSAGE_SUFFIX}\n(${concern.rule.key})`,
				offset + longHalfLength - message.length - MESSAGE_SUFFIX.length,
			)
		: indentString(
				`${MESSAGE_PREFIX} ${message}\n   (${concern.rule.key})`,
				offset + shortHalfLength,
			)

	return `${commitLine}\n${rangeLine}\n${messageLine}`
}

function ruleMessage(rule: RuleContext): string {
	switch (rule.key) {
		case "noBlankSubjectLines": {
			return "Subject lines must contain at least one non-whitespace character."
		}
		case "noExcessiveCommitsPerBranch": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "noMergeCommits": {
			return "Merge commits are not allowed."
		}
		case "noRepeatedSubjectLines": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "noRestrictedFooterLines": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "noRevertRevertCommits": {
			return "Cherry-pick the original commit instead of reverting it over."
		}
		case "noSingleWordSubjectLines": {
			return "Subject lines must contain at least two words."
		}
		case "noSquashMarkers": {
			return "Combine squash commits with their ancestors."
		}
		case "noUnexpectedPunctuation": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "noUnexpectedWhitespace": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "useAuthorEmailPatterns": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "useAuthorNamePatterns": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "useCapitalisedSubjectLines": {
			return "The first letter in subject lines must be in uppercase."
		}
		case "useCommitterEmailPatterns": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "useCommitterNamePatterns": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "useConciseSubjectLines": {
			return `Subject lines must not exceed ${rule.options.maxLength} characters.`
		}
		case "useEmptyLineBeforeBodyLines": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "useImperativeSubjectLines": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "useIssueLinks": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "useLineWrapping": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "useSignedCommits": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
	}
}
