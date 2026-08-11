import { getGitBranchCrudeCommits } from "#commits/git/GetGitBranchCrudeCommits.ts"
import { getConfiguration } from "#configurations/GetConfiguration.ts"
import { getDefaultCommandLineConfiguration } from "#configurations/GetDefaultCommandLineConfiguration.ts"
import { program } from "#programs/Program.ts"
import { EXIT_CODE_GENERAL_ERROR, EXIT_CODE_SUCCESS, type ExitCode } from "#types/ExitCode.ts"
import { assertError } from "#utilities/Assertions.ts"
import { printCommandLineError, printMessage } from "#utilities/logging/Logger.ts"
import type { CometVersion } from "#utilities/version/CometVersion.ts"

export async function commandLineProgram(args: Array<string>): Promise<ExitCode> {
	if (args.includes("--help") || args.includes("-h")) {
		printMessage(getHelpText())
		return EXIT_CODE_SUCCESS
	}
	if (args.includes("--version") || args.includes("-v")) {
		const version: CometVersion = import.meta.env.COMET_VERSION

		printMessage(version)
		return EXIT_CODE_SUCCESS
	}

	try {
		const [crudeCommits, configuration] = await Promise.all([
			getGitBranchCrudeCommits(),
			getConfiguration(getDefaultCommandLineConfiguration()),
		])

		return await program(crudeCommits, configuration)
	} catch (error) {
		assertError(error)
		printCommandLineError(error.message)
		return EXIT_CODE_GENERAL_ERROR
	}
}

export function getHelpText(): string {
	return "Usage: comet [options]"
}
