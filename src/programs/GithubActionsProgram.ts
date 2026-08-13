import { getGithubPullRequestCrudeCommits } from "#commits/github/GetGithubPullRequestCrudeCommits.ts"
import { DEFAULT_GITHUB_ACTIONS_CONFIGURATION } from "#configurations/defaults/DefaultGithubActionsConfiguration.ts"
import { getConfiguration } from "#configurations/GetConfiguration.ts"
import { program } from "#programs/Program.ts"
import { EXIT_CODE_GENERAL_ERROR, type ExitCode } from "#types/ExitCode.ts"
import { assertError } from "#utilities/Assertions.ts"
import { printGithubActionsError } from "#utilities/logging/Logger.ts"

export async function githubActionsProgram(): Promise<ExitCode> {
	try {
		const [crudeCommits, configuration] = await Promise.all([
			getGithubPullRequestCrudeCommits(),
			getConfiguration(DEFAULT_GITHUB_ACTIONS_CONFIGURATION),
		])

		return await program(crudeCommits, configuration)
	} catch (error) {
		assertError(error)
		printGithubActionsError(error.message)
		return EXIT_CODE_GENERAL_ERROR
	}
}
