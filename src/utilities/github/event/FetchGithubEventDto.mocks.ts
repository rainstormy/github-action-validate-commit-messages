import { injectJsonFile } from "#utilities/files/Files.mocks.ts"
import { injectGithubEnv } from "#utilities/github/env/GithubEnv.mocks.ts"
import {
	type GithubPullRequestReference,
	nextDummyGithubPullRequestReference,
} from "#commits/github/GithubPullRequestReference.fixtures.ts"
import { assertNotNullish } from "#utilities/Assertions.ts"
import type { GithubUrlString } from "#utilities/github/api/GithubUrlString.ts"
import type { GithubPullRequestEventDto } from "#utilities/github/event/dtos/GithubPullRequestEventDto.ts"

const eventPath = "/github/workflow/event.json"

export function injectGithubPullRequestEventDto(
	reference: GithubPullRequestReference = nextDummyGithubPullRequestReference(),
): `${GithubUrlString}/pulls/${number}/commits` {
	const [repository, pullRequestId] = reference.split("#")
	assertNotNullish(repository)
	assertNotNullish(pullRequestId)

	const pullRequestNumber = Number.parseInt(pullRequestId, 10)
	const apiBaseUrl = `https://api.github.com/repos/${repository}` as const

	const eventPayload: GithubPullRequestEventDto = {
		pull_request: { number: pullRequestNumber },
	}

	injectGithubEnv({ apiBaseUrl, eventPath })
	injectJsonFile(eventPath, eventPayload)

	return `${apiBaseUrl}/pulls/${pullRequestNumber}/commits`
}

export function injectEmptyGithubEventDto(): void {
	injectGithubEnv({ eventPath })
	injectJsonFile(eventPath, {})
}
