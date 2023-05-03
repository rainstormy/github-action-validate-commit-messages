import type { LimitLengthOfBodyLinesConfiguration, Rule } from "+rules"
import { countOccurrences } from "+utilities"

export function limitLengthOfBodyLines({
	maximumCharacters,
}: LimitLengthOfBodyLinesConfiguration): Rule {
	return {
		key: "limit-length-of-body-lines",
		getInvalidCommits: (refinedCommits) =>
			refinedCommits
				.filter(
					({ parents, bodyLines }) =>
						parents.length === 1 ||
						!bodyLines.some((line) => line.startsWith("Conflicts:")),
				)
				.filter(({ bodyLines }) =>
					bodyLines.some(
						(line, lineNumber) =>
							line.length > maximumCharacters &&
							countOccurrences(line, "`") <= 1 &&
							!isInVerbatimZone(bodyLines, lineNumber),
					),
				),
	}
}

function isInVerbatimZone(
	bodyLines: ReadonlyArray<string>,
	lineNumber: number,
): boolean {
	const numberOfPrecedingTripleBackticksLines = bodyLines
		.slice(0, lineNumber)
		.filter((line) => line.startsWith("```")).length

	return numberOfPrecedingTripleBackticksLines % 2 === 1
}
