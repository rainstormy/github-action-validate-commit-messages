import type { Commit, Commits } from "#commits/Commit.ts"
import { formatTokenisedLine } from "#commits/tokens/Token.ts"
import type { RuleKey } from "#configurations/Configuration.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { requireNotNullish } from "#utilities/Assertions.ts"
import { indentString } from "#utilities/Strings.ts"

export function commitwiseReport(commits: Commits, concerns: Concerns): string {
	return concerns.map((concern) => formatConcern(commits, concern)).join("\n\n")
}

const SHORT_SHA_LENGTH = 7

function formatConcern(commits: Commits, concern: Concern): string {
	const [startIndex] = concern.columns
	const messageOffset = SHORT_SHA_LENGTH + " ".length + startIndex

	const message = `┬\n╰─ ${formatRule(concern.rule)}\n   (${concern.rule})`
	return `${formatCommit(commits, concern)}\n${indentString(message, messageOffset)}`
}

function formatCommit(commits: Commits, concern: Concern): string {
	const commit = requireNotNullish(
		commits.find(({ sha }) => sha === concern.commit),
		() => `Concerned commit ${concern.commit} not found`,
	)

	return `${commit.sha.slice(0, SHORT_SHA_LENGTH)} ${formatSubjectLine(commit)}`
}

function formatSubjectLine(commit: Commit): string {
	return formatTokenisedLine(commit.subjectLine)
}

function formatRule(rule: RuleKey): string {
	switch (rule) {
		case "noExcessiveCommitsPerBranch": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noMergeCommits": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noRepeatedSubjectLines": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noRestrictedFooterLines": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noRevertRevertCommits": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noSingleWordSubjectLines": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "noSquashMarkers": {
			throw new Error(`Not implemented yet: ${rule}`)
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
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useEmptyLineBeforeBodyLines": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useImperativeSubjectLines": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useIssueLinks": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useLineWrapping": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
		case "useSignedCommits": {
			throw new Error(`Not implemented yet: ${rule}`)
		}
	}
}
