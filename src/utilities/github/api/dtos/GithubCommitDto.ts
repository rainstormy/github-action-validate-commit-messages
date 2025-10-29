import { array, type InferOutput, nullable, object, string } from "valibot"
import { commitSha } from "#types/CommitSha.ts"
import { githubCommitUserDto } from "#utilities/github/api/dtos/GithubCommitUserDto.ts"
import { githubParentCommitDto } from "#utilities/github/api/dtos/GithubParentCommitDto.ts"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubCommitDto = InferOutput<ReturnType<typeof githubCommitDto>>

export function githubCommitDto() {
	return object({
		sha: commitSha(),
		parents: array(githubParentCommitDto()),
		commit: object({
			author: nullable(githubCommitUserDto()),
			committer: nullable(githubCommitUserDto()),
			message: string(),
		}),
	})
}
