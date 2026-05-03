import type { Commit, Commits } from "#commits/Commit.ts"
import { formatTokenisedLine } from "#commits/tokens/Token.ts"
import type { Configuration } from "#configurations/Configuration.ts"
import type { CommitConcern } from "#rules/concerns/CommitConcern.ts"
import { type Concern, type Concerns, concernedCommit } from "#rules/concerns/Concern.ts"
import type { SubjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import { formatCharacterRange } from "#types/CharacterRange.ts"
import { requireNotNullish } from "#utilities/Assertions.ts"
import { formatCount, indentString } from "#utilities/Strings.ts"

export function commitwiseReport(
	concerns: Concerns,
	commits: Commits,
	configuration: Configuration,
): string {
	return concerns
		.map((concern) => formatConcern(concern, concernedCommit(concern, commits), configuration))
		.join("\n\n")
}

function formatConcern(concern: Concern, commit: Commit, configuration: Configuration): string {
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
			return formatCommitConcern(concern, commit, configuration)
		}
		case "committer-email-address": {
			throw new Error(`Not implemented yet: ${concern.location}`)
		}
		case "committer-name": {
			throw new Error(`Not implemented yet: ${concern.location}`)
		}
		case "subject-line": {
			return formatSubjectLineConcern(concern, commit, configuration)
		}
	}
}

const SHORT_SHA_LENGTH = 7

const RANGE_PREFIX = "╭─"
const MESSAGE_PREFIX = "╰─"
const MESSAGE_SUFFIX = "─╯"

function formatCommitConcern(
	concern: CommitConcern,
	commit: Commit,
	configuration: Configuration,
): string {
	const formattedSubjectLine = formatTokenisedLine(commit.subjectLine)
	const commitLine = `${commit.sha.slice(0, SHORT_SHA_LENGTH)} ${formattedSubjectLine}`
	const message = ruleMessage(concern.rule, configuration)

	const rangeLine = indentString(
		RANGE_PREFIX + "─".repeat(formattedSubjectLine.length),
		SHORT_SHA_LENGTH - RANGE_PREFIX.length + 1,
	)

	const messageLine = indentString(
		`${MESSAGE_PREFIX} ${message}\n   (${concern.rule})`,
		SHORT_SHA_LENGTH - MESSAGE_PREFIX.length + 1,
	)

	return `${commitLine}\n${rangeLine}\n${messageLine}`
}

function formatSubjectLineConcern(
	concern: SubjectLineConcern,
	commit: Commit,
	configuration: Configuration,
): string {
	const commitLine = `${commit.sha.slice(0, SHORT_SHA_LENGTH)} ${formatTokenisedLine(commit.subjectLine)}`

	const [rangeStart, rangeEnd] = concern.range
	const length = rangeEnd - rangeStart

	const offset = SHORT_SHA_LENGTH + " ".length + rangeStart
	const longHalfLength = Math.trunc(length / 2)
	const shortHalfLength = length - longHalfLength - 1

	const message = ruleMessage(concern.rule, configuration)
	const anchoredRight = message.length + MESSAGE_SUFFIX.length < offset + longHalfLength

	const rangeLine = indentString(formatCharacterRange(concern.range, anchoredRight), offset)

	const messageLine = anchoredRight
		? indentString(
				`${message} ${MESSAGE_SUFFIX}\n(${concern.rule})`,
				offset + longHalfLength - message.length - MESSAGE_SUFFIX.length,
			)
		: indentString(`${MESSAGE_PREFIX} ${message}\n   (${concern.rule})`, offset + shortHalfLength)

	return `${commitLine}\n${rangeLine}\n${messageLine}`
}

function ruleMessage(rule: RuleKey, configuration: Configuration): string {
	switch (rule) {
		case "noBlankSubjectLines": {
			return "Subject lines must contain at least one non-whitespace character."
		}
		case "noExcessiveCommitsPerBranch": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noMergeCommits": {
			return "Merge commits are not allowed."
		}
		case "noRepeatedSubjectLines": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noRestrictedFooterLines": {
			throw new Error(`Not implemented yet: ${rule}`)
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
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noUnexpectedWhitespace": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useAuthorEmailPatterns": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useAuthorNamePatterns": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useCapitalisedSubjectLines": {
			return "The first letter in subject lines must be in uppercase."
		}
		case "useCommitterEmailPatterns": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useCommitterNamePatterns": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useConciseSubjectLines": {
			const options = getRuleOptions(rule, configuration)
			const characterPhrase = formatCount(options.maxLength, "character", "characters")
			return `Subject lines must not exceed ${characterPhrase}.`
		}
		case "useEmptyLineBeforeBodyLines": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useImperativeSubjectLines": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useIssueLinks": {
			const options = getRuleOptions(rule, configuration)
			const positionPhrase =
				options.position === "prefix"
					? "start with"
					: options.position === "suffix"
						? "end with"
						: "include"

			return `Subject lines must ${positionPhrase} an issue link.`
		}
		case "useLineWrapping": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useSignedCommits": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
	}
}

function getRuleOptions<Key extends RuleKey>(
	rule: Key,
	configuration: Configuration,
): NonNullable<RuleOptions<Key>> {
	return requireNotNullish(
		configuration.rules[rule],
		() => `Concern raised for disabled rule '${rule}'`,
	)
}
