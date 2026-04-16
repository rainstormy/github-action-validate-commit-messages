import { mockGithubResourceDto } from "#utilities/github/api/FetchGithubResourceDto.mocks.ts"
import { mockGithubPullRequestEventDto } from "#utilities/github/event/FetchGithubEventDto.mocks.ts"
import {
	type GithubCommitDtoTemplate,
	fakeGithubCommitDto,
} from "#utilities/github/api/dtos/GithubCommitDto.fixtures.ts"

export function mockGithubPullRequestCommitDtos(
	dtos: Array<GithubCommitDtoTemplate>,
	options: { pageSize?: number } = {},
): void {
	const resourceUrl = mockGithubPullRequestEventDto()
	mockGithubResourceDto(resourceUrl, dtos.map(fakeGithubCommitDto), options)
}
