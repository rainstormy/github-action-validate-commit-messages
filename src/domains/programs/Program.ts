import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { getCrudeCommits } from "#commits/GetCrudeCommits.ts"
import { getConfiguration } from "#configurations/GetConfiguration.ts"
import { mapCommitsToConcerns } from "#rules/concerns/Concern.ts"
import { commitwiseReport } from "#rules/reports/CommitwiseReport.ts"
import { EXIT_CODE_GENERAL_ERROR, EXIT_CODE_SUCCESS, type ExitCode } from "#types/ExitCode.ts"
import { assertError } from "#utilities/Assertions.ts"
import { printError, printMessage } from "#utilities/logging/Logger.ts"

export async function program(_args: Array<string>): Promise<ExitCode> {
	try {
		const [crudeCommits, configuration] = await Promise.all([getCrudeCommits(), getConfiguration()])

		const commits = crudeCommits.map((crudeCommit) =>
			mapCrudeCommitToCommit(crudeCommit, configuration.tokens),
		)

		const concerns = mapCommitsToConcerns(commits, configuration.rules)

		if (concerns.length > 0) {
			printMessage(commitwiseReport(concerns, commits, configuration))
			return EXIT_CODE_GENERAL_ERROR
		}

		return EXIT_CODE_SUCCESS
	} catch (error) {
		assertError(error)
		printError(error.message)
		return EXIT_CODE_GENERAL_ERROR
	}
}
