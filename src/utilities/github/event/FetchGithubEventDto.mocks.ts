import { mockJsonFile } from "#utilities/files/Files.mocks.ts"
import { mockGithubEnv } from "#utilities/github/env/GithubEnv.mocks.ts"
import {
	fakeGithubPullRequestReference,
	type GithubPullRequestReference,
} from "#commits/github/GithubPullRequestReference.fixtures.ts"
import { assertNotNullish } from "#utilities/Assertions.ts"
import type { GithubUrlString } from "#utilities/github/api/GithubUrlString.ts"
import type { GithubPullRequestEventDto } from "#utilities/github/event/dtos/GithubPullRequestEventDto.ts"

const eventPath = "/github/workflow/event.json"

export function mockGithubPullRequestEventDto(
	reference: GithubPullRequestReference = fakeGithubPullRequestReference(),
): `${GithubUrlString}/pulls/${number}/commits` {
	const [repository, pullRequestId] = reference.split("#")
	assertNotNullish(repository)
	assertNotNullish(pullRequestId)

	const pullRequestNumber = Number.parseInt(pullRequestId, 10)
	const apiBaseUrl = `https://api.github.com/repos/${repository}` as const

	const eventPayload: GithubPullRequestEventDto = {
		pull_request: { number: pullRequestNumber },
	}

	mockGithubEnv({ apiBaseUrl, eventPath })
	mockJsonFile(eventPath, eventPayload)

	return `${apiBaseUrl}/pulls/${pullRequestNumber}/commits`
}

export function mockEmptyGithubEventDto(): void {
	mockGithubEnv({ eventPath })
	mockJsonFile(eventPath, {})
}
