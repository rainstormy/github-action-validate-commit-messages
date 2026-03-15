import { type InferOutput, object } from "valibot"
import { commitSha } from "#types/CommitSha.ts"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubParentCommitDto = InferOutput<ReturnType<typeof githubParentCommitDto>>

// oxlint-disable-next-line typescript/explicit-function-return-type: Rely on type inference for Valibot schemas.
export function githubParentCommitDto() {
	return object({
		sha: commitSha(),
	})
}
