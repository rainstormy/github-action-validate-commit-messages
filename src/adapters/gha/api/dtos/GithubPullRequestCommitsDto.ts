import { type InferOutput, array } from "valibot"
import { githubCommitDtoSchema } from "#adapters/gha/api/dtos/GithubCommitDto"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubPullRequestCommitsDto = InferOutput<
	typeof githubPullRequestCommitsDtoSchema
>

export const githubPullRequestCommitsDtoSchema = array(githubCommitDtoSchema)
