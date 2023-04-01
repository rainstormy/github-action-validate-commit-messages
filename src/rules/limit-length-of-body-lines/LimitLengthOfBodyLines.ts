import type { LimitLengthOfBodyLinesConfiguration, Rule } from "+rules"
import { countOccurrences } from "+utilities"

export function limitLengthOfBodyLines({
	maximumCharacters,
}: LimitLengthOfBodyLinesConfiguration): Rule {
	return {
		key: "limit-length-of-body-lines",
		validate: ({ parents, bodyLines }) => {
			function isInVerbatimZone(lineNumber: number): boolean {
				const numberOfPrecedingTripleBackticksLines = bodyLines
					.slice(0, lineNumber)
					.filter((line) => line.startsWith("```")).length

				return numberOfPrecedingTripleBackticksLines % 2 === 1
			}

			const isMergeCommitWithConflicts =
				parents.length > 1 &&
				bodyLines.some((line) => line.startsWith("Conflicts:"))

			if (isMergeCommitWithConflicts) {
				return "valid"
			}

			const hasAllBodyLinesWithinLimit = bodyLines.every(
				(line, lineNumber) =>
					line.length <= maximumCharacters ||
					countOccurrences(line, "`") > 1 ||
					isInVerbatimZone(lineNumber),
			)

			return hasAllBodyLinesWithinLimit ? "valid" : "invalid"
		},
	}
}
