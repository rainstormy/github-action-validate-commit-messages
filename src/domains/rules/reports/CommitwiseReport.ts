import type { Commit, Commits } from "#commits/Commit.ts"
import { formatTokenisedLine } from "#commits/tokens/Token.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import type { RuleContext } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import { requireNotNullish } from "#utilities/Assertions.ts"
import { indentString } from "#utilities/Strings.ts"

export function commitwiseReport(commits: Commits, concerns: Concerns): string {
	return concerns.map((concern) => formatConcern(commits, concern)).join("\n\n")
}

const SHORT_SHA_LENGTH = 7

function formatConcern(commits: Commits, concern: Concern): string {
	return `${formatCommit(commits, concern)}\n${formatMessage(concern)}`
}

function formatCommit(commits: Commits, concern: Concern): string {
	const commit = requireNotNullish(
		commits.find(({ sha }) => sha === concern.commitSha),
		() => `Concerned commit ${concern.commitSha} not found`,
	)

	return `${commit.sha.slice(0, SHORT_SHA_LENGTH)} ${formatSubjectLine(commit)}`
}

function formatSubjectLine(commit: Commit): string {
	return formatTokenisedLine(commit.subjectLine)
}

function formatMessage(concern: Concern): string {
	const [start] = concern.range

	const ruleMessage = formatRule(concern.rule)

	const [rangeMarker, rangeOffset] = formatRangeMarker(concern.range)
	const message = `${ruleMessage}\n ${" ".repeat(rangeOffset)}(${concern.rule.key})`

	const messageOffset = SHORT_SHA_LENGTH + " ".length + start
	return indentString(`${rangeMarker} ${message}`, messageOffset)
}

function formatRangeMarker(range: CharacterRange): [string, offset: number] {
	const [start, end] = range
	const length = end - start

	if (length === 1) {
		return ["┬\n╰─", 2]
	}

	const firstHalfLength = Math.trunc((length - "┬".length) / 2)
	const secondHalfLength = length - firstHalfLength - "┬".length

	return [
		`${"─".repeat(firstHalfLength)}┬${"─".repeat(secondHalfLength)}\n${indentString("╰─", firstHalfLength)}`,
		firstHalfLength + 2,
	]
}

function formatRule(rule: RuleContext): string {
	switch (rule.key) {
		case "noExcessiveCommitsPerBranch": {
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "noMergeCommits": {
			throw new Error(`Not implemented yet: ${rule.key}`)
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
			throw new Error(`Not implemented yet: ${rule.key}`)
		}
		case "noSquashMarkers": {
			return "Commits with squash markers must be combined with their ancestors."
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
