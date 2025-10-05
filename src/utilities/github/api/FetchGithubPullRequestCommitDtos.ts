import {
	GITHUB_COMMIT_DTO_SCHEMA,
	type GithubCommitDtos,
} from "#utilities/github/api/dtos/GithubCommitDto"
import { fetchPaginatedGithubDto } from "#utilities/github/api/FetchPaginatedGithubDto"
import { githubEnv } from "#utilities/github/env/GithubEnv"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export async function fetchGithubPullRequestCommitDtos(
	pullRequestNumber: number,
): Promise<GithubCommitDtos> {
	const env = githubEnv()

	return await fetchPaginatedGithubDto(
		`${env.apiBaseUrl}/pulls/${pullRequestNumber}/commits?per_page=30&page=1`,
		GITHUB_COMMIT_DTO_SCHEMA,
	)
}
