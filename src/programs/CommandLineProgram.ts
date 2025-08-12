import { program } from "#programs/Program"
import { EXIT_CODE_SUCCESS, type ExitCode } from "#types/ExitCode"
import { printMessage } from "#utilities/logging/Logger"
import { getPackageJsonVersion } from "#utilities/packagejson/PackageJsonVersion"

export async function commandLineProgram(
	args: Array<string>,
): Promise<ExitCode> {
	if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
		return helpProgram()
	}
	if (args.includes("--version") || args.includes("-v")) {
		return versionProgram()
	}
	return program(args)
}

async function helpProgram(): Promise<ExitCode> {
	printMessage(getHelpText())
	return EXIT_CODE_SUCCESS
}

export function getHelpText(): string {
	return "Usage: comet [options]"
}

async function versionProgram(): Promise<ExitCode> {
	printMessage(getPackageJsonVersion())
	return EXIT_CODE_SUCCESS
}
