import { getCommits } from "#commits/GetCommits"
import { EXIT_CODE_GENERAL_ERROR, type ExitCode } from "#types/ExitCode"
import { printMessage } from "#utilities/logging/Logger"

export async function program(_args: Array<string>): Promise<ExitCode> {
	const commits = await getCommits()
	printMessage(commits.join(" "))
	printMessage("Not implemented yet")
	return EXIT_CODE_GENERAL_ERROR
}
