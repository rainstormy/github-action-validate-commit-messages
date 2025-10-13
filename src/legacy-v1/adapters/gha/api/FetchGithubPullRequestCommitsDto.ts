import { parse } from "valibot"
import {
	type GithubPullRequestCommitsDto,
	githubPullRequestCommitsDtoSchema,
} from "#legacy-v1/adapters/gha/api/dtos/GithubPullRequestCommitsDto.ts"
import { paginatedGithubFetch } from "#legacy-v1/adapters/gha/api/GithubApiPagination.ts"
import {
	githubActionsApiBaseUrl,
	githubActionsRepository,
} from "#legacy-v1/adapters/gha/GithubActionsEnv.ts"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export async function fetchGithubPullRequestCommitsDto(
	pullRequestNumber: number,
): Promise<GithubPullRequestCommitsDto> {
	const apiBaseUrl = githubActionsApiBaseUrl()
	const repository = githubActionsRepository()

	const paginatedResults = await paginatedGithubFetch(
		`${apiBaseUrl}/repos/${repository}/pulls/${pullRequestNumber}/commits?per_page=100`,
	)

	return parse(githubPullRequestCommitsDtoSchema, paginatedResults.flat())
}
