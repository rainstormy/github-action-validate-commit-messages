import {
	type GithubCommitDto,
	githubCommitDto,
} from "#utilities/github/api/dtos/GithubCommitDto.ts"
import { fetchGithubResourceDto } from "#utilities/github/api/FetchGithubResourceDto.ts"
import { githubEnv } from "#utilities/github/env/GithubEnv.ts"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export async function fetchGithubPullRequestCommitDtos(
	pullRequestNumber: number,
): Promise<Array<GithubCommitDto>> {
	const env = githubEnv()

	return await fetchGithubResourceDto(
		`${env.apiBaseUrl}/pulls/${pullRequestNumber}/commits`,
		githubCommitDto(),
	)
}
