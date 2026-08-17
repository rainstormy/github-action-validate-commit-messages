import { getGitBranchCrudeCommits } from "#commits/git/GetGitBranchCrudeCommits.ts"
import { DEFAULT_COMMAND_LINE_CONFIGURATION } from "#configurations/defaults/DefaultCommandLineConfiguration.ts"
import { getConfiguration } from "#configurations/GetConfiguration.ts"
import { program } from "#programs/Program.ts"
import { EXIT_CODE_GENERAL_ERROR, EXIT_CODE_SUCCESS, type ExitCode } from "#types/ExitCode.ts"
import { assertError } from "#utilities/Assertions.ts"
import { printCommandLineError, printMessage } from "#utilities/logging/Logger.ts"
import { getPackageVersion } from "#utilities/package/Package.ts"

export async function commandLineProgram(args: Array<string>): Promise<ExitCode> {
	if (args.includes("--help") || args.includes("-h")) {
		printMessage(getHelpText())
		return EXIT_CODE_SUCCESS
	}
	if (args.includes("--version") || args.includes("-v")) {
		printMessage(getPackageVersion())
		return EXIT_CODE_SUCCESS
	}

	try {
		const [crudeCommits, configuration] = await Promise.all([
			getGitBranchCrudeCommits(),
			getConfiguration(DEFAULT_COMMAND_LINE_CONFIGURATION),
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
