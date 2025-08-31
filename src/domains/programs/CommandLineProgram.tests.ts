import { injectLoggerMock } from "#utilities/logging/Logger.mocks"
import { injectPackageJsonVersionMock } from "#utilities/packagejson/PackageJsonVersion.mocks"
import { beforeEach, describe, expect, it } from "vitest"
import { commandLineProgram, getHelpText } from "#programs/CommandLineProgram"
import { EXIT_CODE_SUCCESS, type ExitCode } from "#types/ExitCode"
import type { SemanticVersionString } from "#types/SemanticVersionString"

const { printMessage } = injectLoggerMock()
const { getPackageJsonVersion } = injectPackageJsonVersionMock()

describe.each`
	args
	${[]}
	${["--help"]}
	${["-h"]}
	${["--config", "configs/comet.jsonc", "--help"]}
	${["-h", "-v"]}
`(
	"when the args of $args contain the '--help'/'-h' flag",
	(props: { args: Array<string> }) => {
		let exitCode: ExitCode

		beforeEach(async () => {
			exitCode = await commandLineProgram(props.args)
		})

		it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
			expect(exitCode).toBe(EXIT_CODE_SUCCESS)
		})

		it("prints a help text with usage instructions", () => {
			expect(printMessage).toHaveBeenCalledWith(getHelpText())
			expect(printMessage).toHaveBeenCalledTimes(1)
		})
	},
)

describe("the help text", () => {
	it("is a list of program arguments and options", () => {
		expect(getHelpText()).toBe("Usage: comet [options]")
	})

	it("fits within 80 columns", () => {
		const lines = getHelpText().split("\n")

		for (const line of lines) {
			expect(line.length).toBeLessThanOrEqual(80)
		}
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
			getPackageJsonVersion.mockReturnValue(props.version)
			exitCode = await commandLineProgram(props.args)
		})

		it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
			expect(exitCode).toBe(EXIT_CODE_SUCCESS)
		})

		it(`prints the tool version of '${props.version}'`, () => {
			expect(printMessage).toHaveBeenCalledWith(props.version)
			expect(printMessage).toHaveBeenCalledTimes(1)
		})
	},
)
