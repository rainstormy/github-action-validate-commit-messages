import { mockCometPlatform } from "#utilities/platform/CometPlatform.mocks.ts"
import { beforeEach, describe, expect, it, type MockInstance, vi } from "vitest"
import { printError } from "#utilities/logging/Logger.ts"

// Undo the automatic use of `mockLogger` in `VitestSetup.mocks.ts`.
vi.unmock("#utilities/logging/Logger.ts")

describe.each`
	errorMessage                                                                                  | expectedErrorMessage
	${"Cannot find the configuration file 'configs/comet.jsonc'."}                                | ${"::error::Cannot find the configuration file 'configs/comet.jsonc'."}
	${"The 'rainstormy/comet' action expects the workflow trigger to be a 'pull_request' event."} | ${"::error::The 'rainstormy/comet' action expects the workflow trigger to be a 'pull_request' event."}
	${"A multiline error message:\n\rIt escapes newlines,\nand carriage returns\r."}              | ${"::error::A multiline error message:%0A%0DIt escapes newlines,%0Aand carriage returns%0D."}
	${"Invalid statement:\nAchieved 100% test coverage!"}                                         | ${"::error::Invalid statement:%0AAchieved 100%25 test coverage!"}
`(
	"when logging an error message of $errorMessage in GitHub Actions",
	(props: { errorMessage: string; expectedErrorMessage: string }) => {
		let consoleLog: ConsoleLogMock

		beforeEach(() => {
			mockCometPlatform("gha")

			consoleLog = mockConsoleLog()
			printError(props.errorMessage)
		})

		it("logs a message with escaped characters and an '::error::' prefix", () => {
			expect(consoleLog).toHaveBeenCalledWith(props.expectedErrorMessage)
		})
	},
)

type ConsoleLogMock = MockInstance<typeof console.log>

function mockConsoleLog(): ConsoleLogMock {
	return vi.spyOn(console, "log").mockImplementation(() => {
		// Do nothing.
	})
}
