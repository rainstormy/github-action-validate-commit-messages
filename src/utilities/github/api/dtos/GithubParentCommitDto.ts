import { type InferOutput, object } from "valibot"
import { commitSha } from "#types/CommitSha.ts"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubParentCommitDto = InferOutput<
	typeof GITHUB_PARENT_COMMIT_DTO_SCHEMA
>

export const GITHUB_PARENT_COMMIT_DTO_SCHEMA = object({
	sha: commitSha(),
})
