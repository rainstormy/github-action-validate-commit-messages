import { beforeEach, describe, expect, it } from "vitest"
import { githubActionsProgram } from "#programs/GithubActionsProgram.ts"
import { EXIT_CODE_GENERAL_ERROR, type ExitCode } from "#types/ExitCode.ts"
import { mockJsonFile, mockNonexistingFile } from "#utilities/files/Files.fakes.ts"
import { mockGithubEnv } from "#utilities/github/env/GithubEnv.fakes.ts"
import { mockEmptyGithubEventDto } from "#utilities/github/event/FetchGithubEventDto.fakes.ts"
import { printError } from "#utilities/logging/Logger.ts"
import { mockCometPlatform } from "#utilities/platform/CometPlatform.fakes.ts"

beforeEach(() => {
	mockCometPlatform("gha")
})

describe("when the event payload is not a pull request", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockEmptyGithubEventDto()
		exitCode = await githubActionsProgram()
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints an error message that describes the expected event payload", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"The 'rainstormy/comet' action expects the workflow trigger to be a 'pull_request' event.",
		)
	})
})

describe("when the event payload is missing in the file system", () => {
	const eventPath = "/github/workflow/event.json"
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGithubEnv({ eventPath })
		mockNonexistingFile(eventPath)
		exitCode = await githubActionsProgram()
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints the error message raised by the file system", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			`Failed to read ${eventPath}: File not found`,
		)
	})
})

describe("when the 'github-token' input parameter is missing", () => {
	const eventPath = "/github/workflow/event.json"
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGithubEnv({ eventPath, __secretToken__: "" })
		mockJsonFile(eventPath, { pull_request: { number: 1 } })
		exitCode = await githubActionsProgram()
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints an error message that describes the expected input parameter", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"The 'rainstormy/comet' action expects the 'github-token' input parameter to be set",
		)
	})
})
