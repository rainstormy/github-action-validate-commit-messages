import * as v from "valibot"
import { commitSha } from "#types/CommitSha.ts"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubParentCommitDto = v.InferOutput<ReturnType<typeof githubParentCommitDto>>

// oxlint-disable-next-line typescript/explicit-function-return-type -- Rely on type inference for Valibot schemas.
export function githubParentCommitDto() {
	return v.object({
		sha: commitSha(),
	})
}
