import {
	type GithubCommitDtoTemplate,
	fakeGithubCommitDto,
} from "#utilities/github/api/dtos/GithubCommitDto.fakes.ts"
import { mockGithubResourceDto } from "#utilities/github/api/FetchGithubResourceDto.fakes.ts"
import { mockGithubPullRequestEventDto } from "#utilities/github/event/FetchGithubEventDto.fakes.ts"

export function mockGithubPullRequestCommitDtos(
	dtos: Array<GithubCommitDtoTemplate>,
	options: { pageSize?: number } = {},
): void {
	const resourceUrl = mockGithubPullRequestEventDto()
	mockGithubResourceDto(resourceUrl, dtos.map(fakeGithubCommitDto), options)
}
