import { getCommits } from "#commits/GetCommits.ts"
import { getConfiguration } from "#configurations/GetConfiguration.ts"
import { EXIT_CODE_GENERAL_ERROR, type ExitCode } from "#types/ExitCode.ts"
import { assertError } from "#utilities/Assertions.ts"
import { printError, printMessage } from "#utilities/logging/Logger.ts"

export async function program(_args: Array<string>): Promise<ExitCode> {
	try {
		const [configuration, commits] = await Promise.all([
			getConfiguration(),
			getCommits(),
		])

		printMessage(JSON.stringify(configuration))
		printMessage(JSON.stringify(commits))
		printMessage("Not implemented yet")

		return EXIT_CODE_GENERAL_ERROR
	} catch (error) {
		assertError(error)
		printError(error.message)
		return EXIT_CODE_GENERAL_ERROR
	}
}
