import { gitUserDtoSchema } from "+adapters/gha/api/dtos/GitUserDto"
import { type InferOutput, array, nullable, object, string } from "valibot"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubCommitDto = InferOutput<typeof githubCommitDtoSchema>

export const githubCommitDtoSchema = object({
	sha: string(),
	commit: object({
		author: nullable(gitUserDtoSchema),
		committer: nullable(gitUserDtoSchema),
		message: string(),
	}),
	parents: array(object({ sha: string() })),
})
