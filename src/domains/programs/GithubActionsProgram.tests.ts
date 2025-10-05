import {
	injectJsonFile,
	injectNonexistingFile,
} from "#utilities/files/Files.mocks.ts"
import { injectGithubEnv } from "#utilities/github/env/GithubEnv.mocks.ts"
import { injectEmptyGithubEventDto } from "#utilities/github/event/FetchGithubEventDto.mocks.ts"
import { injectLogger } from "#utilities/logging/Logger.mocks.ts"
import { injectCometPlatform } from "#utilities/platform/CometPlatform.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import { githubActionsProgram } from "#programs/GithubActionsProgram.ts"
import { EXIT_CODE_GENERAL_ERROR, type ExitCode } from "#types/ExitCode.ts"

beforeEach(() => {
	injectCometPlatform("gha")
})

const { printError } = injectLogger()

describe("when the event payload is not a pull request", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		injectEmptyGithubEventDto()
		exitCode = await githubActionsProgram()
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints an error message that describes the expected event payload", () => {
		expect(printError).toHaveBeenCalledWith(
			"The 'rainstormy/comet' action expects the workflow trigger to be a 'pull_request' event.",
		)
		expect(printError).toHaveBeenCalledTimes(1)
	})
})

describe("when the event payload is missing in the file system", () => {
	const eventPath = "/github/workflow/event.json"
	let exitCode: ExitCode

	beforeEach(async () => {
		injectGithubEnv({ eventPath })
		injectNonexistingFile(eventPath)
		exitCode = await githubActionsProgram()
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints the error message raised by the file system", () => {
		expect(printError).toHaveBeenCalledWith(
			`Failed to read ${eventPath}: File not found`,
		)
		expect(printError).toHaveBeenCalledTimes(1)
	})
})

describe("when the 'github-token' input parameter is missing", () => {
	const eventPath = "/github/workflow/event.json"
	let exitCode: ExitCode

	beforeEach(async () => {
		injectGithubEnv({ eventPath, __secretToken__: "" })
		injectJsonFile(eventPath, { pull_request: { number: 1 } })
		exitCode = await githubActionsProgram()
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints an error message that describes the expected input parameter", () => {
		expect(printError).toHaveBeenCalledWith(
			"The 'rainstormy/comet' action expects the 'github-token' input parameter to be set",
		)
		expect(printError).toHaveBeenCalledTimes(1)
	})
})
