import type { Commit, Commits } from "#commits/Commit.ts"
import { type TokenisedLines, formatTokenisedLine } from "#commits/tokens/Token.ts"
import type { Configuration } from "#configurations/Configuration.ts"
import { pluralise } from "#legacy-v1/utilities/StringUtilities.ts"
import type { BodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { CommitConcern } from "#rules/concerns/CommitConcern.ts"
import { type Concern, type Concerns, concernedCommit } from "#rules/concerns/Concern.ts"
import type { SubjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { UserIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import { formatCharacterRange } from "#types/CharacterRange.ts"
import { requireNotNullish } from "#utilities/Assertions.ts"
import { formatCount, indentString, prefixStringLines } from "#utilities/Strings.ts"

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
		case "body-line": {
			return formatBodyLineConcern(concern, commit, configuration)
		}
		case "commit": {
			return formatCommitConcern(concern, commit, configuration)
		}
		case "subject-line": {
			return formatSubjectLineConcern(concern, commit, configuration)
		}
		case "user-identity": {
			return formatUserIdentityConcern(concern, commit, configuration)
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
	const message = getRuleMessage(concern.rule, configuration)

	const commitLine = getCommitLine(commit)
	const rangeLine = indentString(
		RANGE_PREFIX + "─".repeat(commitLine.length - SHORT_SHA_LENGTH - 1),
		SHORT_SHA_LENGTH - RANGE_PREFIX.length + 1,
	)
	const messageLines = getMessageLines(message, SHORT_SHA_LENGTH - MESSAGE_PREFIX.length + 1)

	return `${commitLine}\n${rangeLine}\n${messageLines}`
}

function formatSubjectLineConcern(
	concern: SubjectLineConcern,
	commit: Commit,
	configuration: Configuration,
): string {
	const message = getRuleMessage(concern.rule, configuration)

	const [rangeStart, rangeEnd] = concern.range
	const length = rangeEnd - rangeStart

	const offset = SHORT_SHA_LENGTH + " ".length + rangeStart
	const longHalfLength = Math.trunc(length / 2)
	const shortHalfLength = length - longHalfLength - 1

	const violationLength = message.violation.length + MESSAGE_SUFFIX.length
	const anchoredRight = violationLength < offset + longHalfLength

	const commitLine = getCommitLine(commit)
	const rangeLine = indentString(formatCharacterRange(concern.range, anchoredRight), offset)
	const messageLines = anchoredRight
		? getMessageLines(message, offset + longHalfLength - violationLength, true)
		: getMessageLines(message, offset + shortHalfLength)

	return `${commitLine}\n${rangeLine}\n${messageLines}`
}

function formatBodyLineConcern(
	concern: BodyLineConcern,
	commit: Commit,
	configuration: Configuration,
): string {
	const message = getRuleMessage(concern.rule, configuration)

	const [rangeStart, rangeEnd] = concern.range
	const length = rangeEnd - rangeStart

	const gutterWidth = Math.ceil(Math.log10(concern.line + 2)) + 3
	const concernGutter = indentString("· ", gutterWidth)

	const offset = gutterWidth + 2 + rangeStart
	const longHalfLength = Math.trunc(length / 2)
	const shortHalfLength = length - longHalfLength - 1

	const violationLength = message.violation.length + MESSAGE_SUFFIX.length
	const anchoredRight = violationLength < offset + longHalfLength

	const commitLine = getCommitLine(commit)

	const precedingBodyLine = getBodyLine(commit.bodyLines, concern.line - 1, gutterWidth)
	const blockHeadLines = `${indentString("╭──", gutterWidth)}\n${precedingBodyLine}`

	const concernedBodyLine = getBodyLine(commit.bodyLines, concern.line, gutterWidth, true)

	const rangeLine = `${concernGutter}${indentString(
		formatCharacterRange(concern.range, anchoredRight),
		rangeStart,
	)}`

	const messageLines = anchoredRight
		? getMessageLines(message, rangeStart + longHalfLength - violationLength, true)
		: getMessageLines(message, rangeStart + shortHalfLength)

	const succeedingBodyLine = getBodyLine(commit.bodyLines, concern.line + 1, gutterWidth)
	const blockTailLines = `${succeedingBodyLine}${indentString("╰──", gutterWidth)}`

	return `${commitLine}\n${blockHeadLines}${concernedBodyLine}${rangeLine}\n${prefixStringLines(messageLines, concernGutter)}\n${blockTailLines}`
}

function getBodyLine(
	bodyLines: TokenisedLines,
	lineNumber: number,
	gutterWidth: number,
	isConcernedLine = false,
): string {
	const bodyLine = bodyLines[lineNumber] ?? null

	if (bodyLine === null) {
		return ""
	}

	const formattedLineNumber = (lineNumber + 1).toString().padStart(gutterWidth - 3, " ")
	return `${isConcernedLine ? "∙" : " "} ${formattedLineNumber} │ ${formatTokenisedLine(bodyLine)}\n`
}

function formatUserIdentityConcern(
	concern: UserIdentityConcern,
	commit: Commit,
	configuration: Configuration,
): string {
	const message = getRuleMessage(concern.rule, configuration)

	const identityLine = `╰─ ${getIdentityLine(concern, commit)}`

	const identityOffset = identityLine.indexOf(":")
	const identityLength = identityLine.length - identityOffset - 2

	const commitLine = getCommitLine(commit)
	const rangeLine = indentString(RANGE_PREFIX + "─".repeat(identityLength), identityOffset)
	const messageLines = getMessageLines(message, identityOffset)

	return `${commitLine}\n${identityLine}\n${rangeLine}\n${messageLines}`
}

function getCommitLine(commit: Commit): string {
	return `${commit.sha.slice(0, SHORT_SHA_LENGTH)} ${formatTokenisedLine(commit.subjectLine)}`
}

function getIdentityLine(concern: UserIdentityConcern, commit: Commit): string {
	switch (concern.field) {
		case "author:email": {
			return `authored by: ${commit.authorEmail}`
		}
		case "author:name": {
			return `authored by: ${commit.authorName}`
		}
		case "committer:email": {
			return `committed by: ${commit.committerEmail}`
		}
		case "committer:name": {
			return `committed by: ${commit.committerName}`
		}
	}
}

function getMessageLines(message: RuleMessage, offset: number, anchoredRight = false): string {
	const sidenotes = `(${message.rule})${message.sidenote ? `\n\n${message.sidenote}` : ""}`

	return anchoredRight
		? indentString(`${message.violation} ${MESSAGE_SUFFIX}\n${sidenotes}`, offset)
		: indentString(`${MESSAGE_PREFIX} ${message.violation}\n${indentString(sidenotes, 3)}`, offset)
}

type RuleMessage = {
	rule: RuleKey
	violation: string
	sidenote: string
}

function getRuleMessage(rule: RuleKey, configuration: Configuration): RuleMessage {
	function ruleMessage(violation: string, sidenote = ""): RuleMessage {
		return { rule, violation, sidenote }
	}

	switch (rule) {
		case "noBlankSubjectLines": {
			return ruleMessage("Subject lines must contain at least one non-whitespace character.")
		}
		case "noExcessiveCommitsPerBranch": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noMergeCommits": {
			return ruleMessage("Merge commits are not allowed.")
		}
		case "noRepeatedSubjectLines": {
			return ruleMessage("Commits must have unique subject lines within a branch.")
		}
		case "noRestrictedFooterLines": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noRevertRevertCommits": {
			return ruleMessage("Cherry-pick the original commit instead of reverting it over.")
		}
		case "noSingleWordSubjectLines": {
			return ruleMessage("Subject lines must contain at least two words.")
		}
		case "noSquashMarkers": {
			return ruleMessage("Combine squash commits with their ancestors.")
		}
		case "noUnexpectedPunctuation": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noUnexpectedWhitespace": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useAuthorEmailPatterns": {
			const options = getRuleOptions(rule, configuration)
			const patternPhrase = pluralise(options.patterns.length, "pattern", "patterns")
			return ruleMessage(
				"Email addresses of commit authors must match an accepted pattern.",
				`Accepted ${patternPhrase}:\n${options.patterns.map((pattern) => `  - ${pattern}`).join("\n")}`,
			)
		}
		case "useAuthorNamePatterns": {
			const options = getRuleOptions(rule, configuration)
			const patternPhrase = pluralise(options.patterns.length, "pattern", "patterns")
			return ruleMessage(
				"Names of commit authors must match an accepted pattern.",
				`Accepted ${patternPhrase}:\n${options.patterns.map((pattern) => `  - ${pattern}`).join("\n")}`,
			)
		}
		case "useCapitalisedSubjectLines": {
			return ruleMessage("The first letter in subject lines must be in uppercase.")
		}
		case "useCommitterEmailPatterns": {
			const options = getRuleOptions(rule, configuration)
			const patternPhrase = pluralise(options.patterns.length, "pattern", "patterns")
			return ruleMessage(
				"Email addresses of committers must match an accepted pattern.",
				`Accepted ${patternPhrase}:\n${options.patterns.map((pattern) => `  - ${pattern}`).join("\n")}`,
			)
		}
		case "useCommitterNamePatterns": {
			const options = getRuleOptions(rule, configuration)
			const patternPhrase = pluralise(options.patterns.length, "pattern", "patterns")
			return ruleMessage(
				"Names of committers must match an accepted pattern.",
				`Accepted ${patternPhrase}:\n${options.patterns.map((pattern) => `  - ${pattern}`).join("\n")}`,
			)
		}
		case "useConciseSubjectLines": {
			const options = getRuleOptions(rule, configuration)
			const characterPhrase = formatCount(options.maxLength, "character", "characters")
			return ruleMessage(`Subject lines must not exceed ${characterPhrase}.`)
		}
		case "useEmptyLineBeforeBodyLines": {
			return ruleMessage(
				"Subject lines and message bodies must be separated by exactly one empty line.",
			)
		}
		case "useImperativeSubjectLines": {
			return ruleMessage("Subject lines must start with a verb in the imperative mood.")
		}
		case "useIssueLinks": {
			const options = getRuleOptions(rule, configuration)
			const positionPhrase =
				options.position === "prefix"
					? "start with"
					: options.position === "suffix"
						? "end with"
						: "include"

			const examples = configuration.tokens.issueLinkPrefixes.map((prefix) => `${prefix}123`)
			const examplePhrase = pluralise(examples.length, "Example", "Examples")

			return ruleMessage(
				`Subject lines must ${positionPhrase} an issue link.`,
				`${examplePhrase}: ${examples.join(", ")}`,
			)
		}
		case "useLineWrapping": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useSignedCommits": {
			return ruleMessage("Commits must be signed cryptographically with a signing key.")
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
