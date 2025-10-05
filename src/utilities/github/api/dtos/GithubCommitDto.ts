import { array, type InferOutput, nullable, object, string } from "valibot"
import { commitSha } from "#types/CommitSha.ts"
import { GITHUB_COMMIT_USER_DTO_SCHEMA } from "#utilities/github/api/dtos/GithubCommitUserDto.ts"
import { GITHUB_PARENT_COMMIT_DTO_SCHEMA } from "#utilities/github/api/dtos/GithubParentCommitDto.ts"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubCommitDto = InferOutput<typeof GITHUB_COMMIT_DTO_SCHEMA>

export const GITHUB_COMMIT_DTO_SCHEMA = object({
	sha: commitSha(),
	parents: array(GITHUB_PARENT_COMMIT_DTO_SCHEMA),
	commit: object({
		author: nullable(GITHUB_COMMIT_USER_DTO_SCHEMA),
		committer: nullable(GITHUB_COMMIT_USER_DTO_SCHEMA),
		message: string(),
	}),
})
