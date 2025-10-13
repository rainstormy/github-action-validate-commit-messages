import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit.ts"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule.ts"
import type { LegacyV1LimitLengthOfBodyLinesConfiguration } from "#legacy-v1/rules/LimitLengthOfBodyLines/LegacyV1LimitLengthOfBodyLinesConfiguration.ts"
import { countOccurrences } from "#legacy-v1/utilities/IterableUtilities.ts"

export function legacyV1LimitLengthOfBodyLines({
	maximumCharacters,
}: LegacyV1LimitLengthOfBodyLinesConfiguration): LegacyV1Rule {
	return {
		key: "limit-length-of-body-lines",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
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
							!line.includes("https://") &&
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
