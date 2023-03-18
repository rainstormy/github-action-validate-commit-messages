import type { LimitLineLengthsConfiguration, Rule } from "+rules"
import { countOccurrences } from "+utilities"

export function limitLineLengths({
	maximumCharactersInBodyLine,
	maximumCharactersInSubjectLine,
}: LimitLineLengthsConfiguration): Rule {
	return {
		key: "limit-line-lengths",
		validate: ({ refinedSubjectLine, bodyLines, parents }) => {
			function isInVerbatimZone(lineNumber: number): boolean {
				const numberOfPrecedingTripleBackticksLines = bodyLines
					.slice(0, lineNumber)
					.filter((line) => line.startsWith("```")).length

				return numberOfPrecedingTripleBackticksLines % 2 === 1
			}

			const isRevertCommit = refinedSubjectLine.startsWith("Revert ")
			const isMergeCommitWithDefaultSubjectLine =
				parents.length > 1 && refinedSubjectLine.startsWith("Merge ")

			const isIgnorableCommit =
				isRevertCommit || isMergeCommitWithDefaultSubjectLine

			if (isIgnorableCommit) {
				return "valid"
			}

			const hasSubjectLineWithinLimit =
				maximumCharactersInSubjectLine === 0 ||
				refinedSubjectLine.length <= maximumCharactersInSubjectLine ||
				countOccurrences(refinedSubjectLine, "`") > 1

			const hasAllBodyLinesWithinLimit =
				maximumCharactersInBodyLine === 0 ||
				bodyLines.every(
					(line, lineNumber) =>
						line.length <= maximumCharactersInBodyLine ||
						countOccurrences(line, "`") > 1 ||
						isInVerbatimZone(lineNumber),
				)

			return hasSubjectLineWithinLimit && hasAllBodyLinesWithinLimit
				? "valid"
				: "invalid"
		},
	}
}
