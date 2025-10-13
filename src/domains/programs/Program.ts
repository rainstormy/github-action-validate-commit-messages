import { getCommits } from "#commits/GetCommits.ts"
import { getConfiguration } from "#configurations/GetConfiguration.ts"
import { EXIT_CODE_GENERAL_ERROR, type ExitCode } from "#types/ExitCode.ts"
import { printMessage } from "#utilities/logging/Logger.ts"

export async function program(_args: Array<string>): Promise<ExitCode> {
	const [configuration, commits] = await Promise.all([
		getConfiguration(),
		getCommits(),
	])

	printMessage(JSON.stringify(configuration))
	printMessage(JSON.stringify(commits))
	printMessage("Not implemented yet")

	return EXIT_CODE_GENERAL_ERROR
}
