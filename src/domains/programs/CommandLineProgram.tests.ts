import { beforeEach, describe, expect, it } from "vitest"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fakes.ts"
import { mockCrudeCommits } from "#commits/GetCrudeCommits.fakes.ts"
import { commandLineProgram, getHelpText } from "#programs/CommandLineProgram.ts"
import { EXIT_CODE_GENERAL_ERROR, EXIT_CODE_SUCCESS, type ExitCode } from "#types/ExitCode.ts"
import type { SemanticVersionString } from "#types/SemanticVersionString.ts"
import { mockGitCommand } from "#utilities/git/cli/RunGitCommand.fakes.ts"
import { printError, printMessage } from "#utilities/logging/Logger.ts"
import { mockCometPlatform } from "#utilities/platform/CometPlatform.fakes.ts"
import { mockCometVersion } from "#utilities/version/CometVersion.fakes.ts"

beforeEach(() => {
	mockCometPlatform("cli")
})

describe("the help text", () => {
	it("is a list of program arguments and options", () => {
		expect(getHelpText()).toBe("Usage: comet [options]")
	})

	it("fits within a window of 80 characters", () => {
		const lines = getHelpText().split("\n")

		for (const line of lines) {
			expect(line.length).toBeLessThanOrEqual(80)
		}
	})
})

describe.each`
	args
	${["--help"]}
	${["-h"]}
	${["--config", "configs/comet.jsonc", "--help"]}
	${["-h", "-v"]}
`("when the args of $args contain the '--help'/'-h' flag", (props: { args: Array<string> }) => {
	let exitCode: ExitCode

	beforeEach(async () => {
		exitCode = await commandLineProgram(props.args)
	})

	it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
		expect(exitCode).toBe(EXIT_CODE_SUCCESS)
	})

	it("prints a help text with usage instructions", () => {
		expect(printMessage).toHaveBeenCalledExactlyOnceWith(getHelpText())
	})
})

describe.each`
	args                                                | version
	${["--version"]}                                    | ${"1.0.0"}
	${["-v"]}                                           | ${"2.0.8"}
	${["--config", "configs/comet.jsonc", "--version"]} | ${"3.2.0-beta.1"}
`(
	"when the args of $args contain the '--version'/'-v' flag and the tool version in the 'package.json' file is $version",
	(props: { args: Array<string>; version: SemanticVersionString }) => {
		let exitCode: ExitCode

		beforeEach(async () => {
			mockCometVersion(props.version)
			exitCode = await commandLineProgram(props.args)
		})

		it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
			expect(exitCode).toBe(EXIT_CODE_SUCCESS)
		})

		it(`prints the tool version of '${props.version}'`, () => {
			expect(printMessage).toHaveBeenCalledExactlyOnceWith(props.version)
		})
	},
)

describe("when the default Git branch cannot be determined", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGitCommand("remote", { output: "" })
		mockGitCommand("rev-parse --verify --quiet main", { exitCode: 1 })
		mockGitCommand("rev-parse --verify --quiet master", { exitCode: 1 })
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints an error message that describes the unexpected Git state", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"Expected a default remote branch (e.g. 'origin/main') or a local branch named 'main' or 'master'",
		)
	})
})

describe("when the 'git remote' command raises an error", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGitCommand("remote", { exitCode: 1 })
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints the error message raised by the local Git client", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"Command 'git remote' failed with exit code 1",
		)
	})
})

describe("when the 'git rev-parse' command raises an error", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGitCommand("remote", { output: "origin" })
		mockGitCommand("rev-parse --abbrev-ref origin/HEAD", { exitCode: 128 })
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints the error message raised by the local Git client", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"Command 'git rev-parse --abbrev-ref origin/HEAD' failed with exit code 128",
		)
	})
})

describe("when the 'git log' command raises an error", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGitCommand("remote", { output: "origin" })
		mockGitCommand("rev-parse --abbrev-ref origin/HEAD", { output: "origin/main" })
		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", { exitCode: 31 })
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints the error message raised by the local Git client", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"Command 'git --no-pager log --format=raw --no-color origin/main..HEAD' failed with exit code 31",
		)
	})
})

describe("when there are no commits", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
		expect(exitCode).toBe(EXIT_CODE_SUCCESS)
	})

	it("remains silent", () => {
		expect(printMessage).not.toHaveBeenCalled()
		expect(printError).not.toHaveBeenCalled()
	})
})

describe("when there is 1 commit that raises no concerns in the default configuration", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([fakeCrudeCommit({ message: "Release the robot butler" })])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
		expect(exitCode).toBe(EXIT_CODE_SUCCESS)
	})

	it("remains silent", () => {
		expect(printMessage).not.toHaveBeenCalled()
		expect(printError).not.toHaveBeenCalled()
	})
})

describe("when there are 4 commits that raise no concerns in the default configuration", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([
			fakeCrudeCommit({ message: "Establish the repository" }),
			fakeCrudeCommit({ message: "Enable the coffee machine integration tests" }),
			fakeCrudeCommit({ message: "Drop the legacy spaghetti tower module" }),
			fakeCrudeCommit({ message: "Help fix the annoying bug" }),
		])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
		expect(exitCode).toBe(EXIT_CODE_SUCCESS)
	})

	it("remains silent", () => {
		expect(printMessage).not.toHaveBeenCalled()
		expect(printError).not.toHaveBeenCalled()
	})
})
