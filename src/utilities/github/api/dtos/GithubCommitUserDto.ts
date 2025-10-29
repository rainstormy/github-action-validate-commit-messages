import { exactOptional, type InferOutput, object, string } from "valibot"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubCommitUserDto = InferOutput<
	ReturnType<typeof githubCommitUserDto>
>

export function githubCommitUserDto() {
	return object({
		name: exactOptional(string()),
		email: exactOptional(string()),
	})
}
