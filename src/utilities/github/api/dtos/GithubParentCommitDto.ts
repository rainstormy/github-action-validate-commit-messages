import { type InferOutput, object } from "valibot"
import { commitSha } from "#types/CommitSha.ts"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubParentCommitDto = InferOutput<
	ReturnType<typeof githubParentCommitDto>
>

export function githubParentCommitDto() {
	return object({
		sha: commitSha(),
	})
}
