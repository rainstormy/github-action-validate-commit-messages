import { injectCometPlatform } from "#utilities/platform/CometPlatform.mocks.ts"
import { beforeEach, describe, expect, it, type MockInstance, vi } from "vitest"
import { printError } from "#utilities/logging/Logger.ts"

describe.each`
	errorMessage                                                                                  | expectedErrorMessage
	${"Cannot find the configuration file 'configs/comet.jsonc'."}                                | ${"::error::Cannot find the configuration file 'configs/comet.jsonc'."}
	${"The 'rainstormy/comet' action expects the workflow trigger to be a 'pull_request' event."} | ${"::error::The 'rainstormy/comet' action expects the workflow trigger to be a 'pull_request' event."}
	${"A multiline error message:\n\rIt escapes newlines,\nand carriage returns\r."}              | ${"::error::A multiline error message:%0A%0DIt escapes newlines,%0Aand carriage returns%0D."}
	${"Invalid statement:\nAchieved 100% test coverage!"}                                         | ${"::error::Invalid statement:%0AAchieved 100%25 test coverage!"}
`(
	"when logging an error message of $errorMessage in GitHub Actions",
	(props: { errorMessage: string; expectedErrorMessage: string }) => {
		let consoleSpy: MockInstance

		beforeEach(() => {
			injectCometPlatform("gha")

			consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
				// Do nothing.
			})
			printError(props.errorMessage)
		})

		it("logs a message with escaped characters and an '::error::' prefix", () => {
			expect(consoleSpy).toHaveBeenCalledWith(props.expectedErrorMessage)
		})
	},
)
