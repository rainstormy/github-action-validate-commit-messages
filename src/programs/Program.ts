import { getCommits } from "#commits/GetCommits"
import { getConfiguration } from "#configurations/GetConfiguration"
import { EXIT_CODE_GENERAL_ERROR, type ExitCode } from "#types/ExitCode"
import { printMessage } from "#utilities/logging/Logger"

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
