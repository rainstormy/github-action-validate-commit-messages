import {
	GITHUB_COMMIT_DTO_SCHEMA,
	type GithubCommitDto,
} from "#utilities/github/api/dtos/GithubCommitDto.ts"
import { fetchPaginatedGithubResourceDto } from "#utilities/github/api/FetchPaginatedGithubResourceDto.ts"
import { githubEnv } from "#utilities/github/env/GithubEnv.ts"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export async function fetchGithubPullRequestCommitDtos(
	pullRequestNumber: number,
): Promise<Array<GithubCommitDto>> {
	const env = githubEnv()

	return await fetchPaginatedGithubResourceDto(
		`${env.apiBaseUrl}/pulls/${pullRequestNumber}/commits`,
		GITHUB_COMMIT_DTO_SCHEMA,
	)
}
