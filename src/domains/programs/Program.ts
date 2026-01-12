import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { getCrudeCommits } from "#commits/CrudeCommit.ts"
import { getConfiguration } from "#configurations/GetConfiguration.ts"
import { mapCommitsToConcerns } from "#rules/Rule.ts"
import { EXIT_CODE_GENERAL_ERROR, type ExitCode } from "#types/ExitCode.ts"
import { assertError } from "#utilities/Assertions.ts"
import { printError, printMessage } from "#utilities/logging/Logger.ts"

export async function program(_args: Array<string>): Promise<ExitCode> {
	try {
		const [crudeCommits, configuration] = await Promise.all([
			getCrudeCommits(),
			getConfiguration(),
		])

		const commits = crudeCommits.map((crudeCommit) =>
			mapCrudeCommitToCommit(crudeCommit, configuration),
		)

		const concerns = mapCommitsToConcerns(commits, configuration)

		printMessage(JSON.stringify(concerns))
		printMessage("Not implemented yet")

		return EXIT_CODE_GENERAL_ERROR
	} catch (error) {
		assertError(error)
		printError(error.message)
		return EXIT_CODE_GENERAL_ERROR
	}
}
