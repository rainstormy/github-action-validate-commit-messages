import {
	mockEmptyGithubEventDto,
	mockGithubPullRequestEventDto,
} from "#utilities/github/event/FetchGithubEventDto.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import { getGithubPullRequestNumber } from "#utilities/github/event/GetGithubPullRequestNumber.ts"

describe.each`
	pullRequestNumber
	${4}
	${127}
`(
	"when the GitHub event payload is pull request #$pullRequestNumber",
	async (props: { pullRequestNumber: number }) => {
		const reference = `rainstormy/comet#${props.pullRequestNumber}` as const

		beforeEach(() => {
			mockGithubPullRequestEventDto(reference)
		})

		it(`has a pull request number of ${props.pullRequestNumber}`, async () => {
			const actualPullRequestNumber = await getGithubPullRequestNumber()
			expect(actualPullRequestNumber).toBe(props.pullRequestNumber)
		})
	},
)

describe("when the GitHub event payload is an illegal pull request #0", async () => {
	const reference = "rainstormy/comet#0"

	beforeEach(() => {
		mockGithubPullRequestEventDto(reference)
	})

	it("does not have a pull request number", async () => {
		const actualPullRequestNumber = await getGithubPullRequestNumber()
		expect(actualPullRequestNumber).toBeNull()
	})
})

describe("when the GitHub event payload is not a pull request", async () => {
	beforeEach(() => {
		mockEmptyGithubEventDto()
	})

	it("does not have a pull request number", async () => {
		const actualPullRequestNumber = await getGithubPullRequestNumber()
		expect(actualPullRequestNumber).toBeNull()
	})
})
