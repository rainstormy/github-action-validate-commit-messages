import type { LimitLengthOfSubjectLinesConfiguration, Rule } from "+rules"
import { countOccurrences } from "+utilities"

export function limitLengthOfSubjectLines({
	maximumCharacters,
}: LimitLengthOfSubjectLinesConfiguration): Rule {
	return {
		key: "limit-length-of-subject-lines",
		validate: ({ refinedSubjectLine, parents }) => {
			const isRevertCommit = refinedSubjectLine.startsWith("Revert ")
			const isMergeCommitWithDefaultSubjectLine =
				parents.length > 1 && refinedSubjectLine.startsWith("Merge ")

			const isIgnorableCommit =
				isRevertCommit || isMergeCommitWithDefaultSubjectLine

			if (isIgnorableCommit) {
				return "valid"
			}

			const hasSubjectLineWithinLimit =
				refinedSubjectLine.length <= maximumCharacters ||
				countOccurrences(refinedSubjectLine, "`") > 1

			return hasSubjectLineWithinLimit ? "valid" : "invalid"
		},
	}
}
