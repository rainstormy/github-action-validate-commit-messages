import { type InferOutput, exactOptional, object, string } from "valibot"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubCommitUserDto = InferOutput<ReturnType<typeof githubCommitUserDto>>

// oxlint-disable-next-line typescript/explicit-function-return-type: Rely on type inference for Valibot schemas.
export function githubCommitUserDto() {
	return object({
		name: exactOptional(string()),
		email: exactOptional(string()),
	})
}
