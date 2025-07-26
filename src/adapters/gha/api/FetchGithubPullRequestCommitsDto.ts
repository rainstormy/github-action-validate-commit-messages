import { parse } from "valibot"
import {
	githubActionsApiBaseUrl,
	githubActionsRepository,
} from "#adapters/gha/GithubActionsEnv"
import { paginatedGithubFetch } from "#adapters/gha/api/GithubApiPagination"
import {
	type GithubPullRequestCommitsDto,
	githubPullRequestCommitsDtoSchema,
} from "#adapters/gha/api/dtos/GithubPullRequestCommitsDto"

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
