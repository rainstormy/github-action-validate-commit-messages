import { injectJsonFile } from "#utilities/files/Files.mocks"
import { beforeEach, describe, expect, it } from "vitest"
import type { JsonValue } from "#types/JsonValue"
import { injectGithubEnv } from "#utilities/github/env/GithubEnv.fixtures"
import type { GithubPullRequestEventDto } from "#utilities/github/event/dtos/GithubPullRequestEventDto"
import { getGithubPullRequestNumber } from "#utilities/github/event/GetGithubPullRequestNumber"

const eventPath = "/github/workflow/event.json"

beforeEach(() => {
	injectGithubEnv({ eventPath })
})

describe.each`
	pullRequestNumber
	${4}
	${127}
`(
	"when the GitHub event payload is pull request #$pullRequestNumber",
	async (props: { pullRequestNumber: number }) => {
		let actualPullRequestNumber: number | null

		beforeEach(async () => {
			const eventPayload: GithubPullRequestEventDto = {
				pull_request: { number: props.pullRequestNumber },
			}

			injectJsonFile(eventPath, eventPayload)
			actualPullRequestNumber = await getGithubPullRequestNumber()
		})

		it(`has a pull request number of ${props.pullRequestNumber}`, async () => {
			expect(actualPullRequestNumber).toBe(props.pullRequestNumber)
		})
	},
)

describe("when the GitHub event payload is not a pull request", async () => {
	let actualPullRequestNumber: number | null

	beforeEach(async () => {
		const eventPayload: JsonValue = {}

		injectJsonFile(eventPath, eventPayload)
		actualPullRequestNumber = await getGithubPullRequestNumber()
	})

	it("does not have a pull request number", async () => {
		expect(actualPullRequestNumber).toBeNull()
	})
})
