import { beforeEach, describe, expect, it } from "vitest"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fakes.ts"
import { mockCrudeCommits } from "#commits/GetCrudeCommits.fakes.ts"
import { githubActionsProgram } from "#programs/GithubActionsProgram.ts"
import { EXIT_CODE_GENERAL_ERROR, EXIT_CODE_SUCCESS, type ExitCode } from "#types/ExitCode.ts"
import { mockJsonFile, mockNonexistingFile } from "#utilities/files/Files.fakes.ts"
import {
	mockNonexistingGithubResourceDto,
	mockSabotagedGithubResourceDto,
} from "#utilities/github/api/FetchGithubResourceDto.fakes.ts"
import type { GithubUrlString } from "#utilities/github/api/GithubUrlString.ts"
import { mockGithubEnv } from "#utilities/github/env/GithubEnv.fakes.ts"
import {
	mockEmptyGithubEventDto,
	mockGithubPullRequestEventDto,
} from "#utilities/github/event/FetchGithubEventDto.fakes.ts"
import { printError, printMessage } from "#utilities/logging/Logger.ts"
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

describe("when the pull request does not exist", () => {
	let resourceUrl: `${GithubUrlString}/${string}`
	let exitCode: ExitCode

	beforeEach(async () => {
		resourceUrl = mockGithubPullRequestEventDto()
		mockNonexistingGithubResourceDto(resourceUrl, {
			documentationUrl: "https://docs.github.com/rest/pulls/pulls#list-commits-on-a-pull-request",
		})
		exitCode = await githubActionsProgram()
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints the error message returned by the GitHub REST API", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			`Failed to fetch '${resourceUrl}': 404 Not Found`,
		)
	})
})

describe("when a network error occurs while fetching data from the GitHub REST API", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		const resourceUrl = mockGithubPullRequestEventDto()
		mockSabotagedGithubResourceDto(resourceUrl)
		exitCode = await githubActionsProgram()
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints an error message that describes the network error", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith("Network timeout")
	})
})

describe("when there are no commits", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([])
		exitCode = await githubActionsProgram()
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
		exitCode = await githubActionsProgram()
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
		exitCode = await githubActionsProgram()
	})

	it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
		expect(exitCode).toBe(EXIT_CODE_SUCCESS)
	})

	it("remains silent", () => {
		expect(printMessage).not.toHaveBeenCalled()
		expect(printError).not.toHaveBeenCalled()
	})
})
