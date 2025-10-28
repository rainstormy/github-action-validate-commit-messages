import { mockGithubResourceDto } from "#utilities/github/api/FetchGithubResourceDto.mocks.ts"
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
	mockGithubResourceDto<GithubCommitDto>(
		resourceUrl,
		dtos.map(fakeGithubCommitDto),
		options,
	)
}
