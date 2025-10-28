import { mockPaginatedGithubResourceDto } from "#utilities/github/api/FetchPaginatedGithubResourceDto.mocks.ts"
import { mockGithubPullRequestEventDto } from "#utilities/github/event/FetchGithubEventDto.mocks.ts"
import {
	fakeGithubCommitDto,
	type GithubCommitDtoTemplate,
} from "#utilities/github/api/dtos/GithubCommitDto.fixtures.ts"
import type { GithubCommitDto } from "#utilities/github/api/dtos/GithubCommitDto.ts"

export function mockGithubPullRequestCommitDtos(
	dtos: Array<GithubCommitDtoTemplate>,
	options: { pageSize?: number } = {},
): void {
	const resourceUrl = mockGithubPullRequestEventDto()
	mockPaginatedGithubResourceDto<GithubCommitDto>(
		resourceUrl,
		dtos.map(fakeGithubCommitDto),
		options,
	)
}
