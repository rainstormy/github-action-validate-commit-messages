import { injectPaginatedGithubResourceDto } from "#utilities/github/api/FetchPaginatedGithubResourceDto.mocks.ts"
import { injectGithubPullRequestEventDto } from "#utilities/github/event/FetchGithubEventDto.mocks.ts"
import {
	dummyGithubCommitDto,
	type GithubCommitDtoTemplate,
} from "#utilities/github/api/dtos/GithubCommitDto.fixtures.ts"
import type { GithubCommitDto } from "#utilities/github/api/dtos/GithubCommitDto.ts"

export function injectGithubPullRequestCommitDtos(
	dtos: Array<GithubCommitDtoTemplate>,
	options: { pageSize?: number } = {},
): void {
	const resourceUrl = injectGithubPullRequestEventDto()
	injectPaginatedGithubResourceDto<GithubCommitDto>(
		resourceUrl,
		dtos.map(dummyGithubCommitDto),
		options,
	)
}
