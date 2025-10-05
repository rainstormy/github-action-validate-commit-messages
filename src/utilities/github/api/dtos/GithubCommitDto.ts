import {
	array,
	type InferOutput,
	nullable,
	object,
	optional,
	string,
} from "valibot"
import { commitSha } from "#types/CommitSha"

/**
 * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-commits-on-a-pull-request
 */
export type GithubCommitDto = InferOutput<typeof GITHUB_COMMIT_DTO_SCHEMA>
export type GithubCommitDtos = Array<GithubCommitDto>

export const GITHUB_COMMIT_DTO_SCHEMA = object({
	sha: commitSha(),
	parents: array(object({ sha: commitSha() })),
	commit: object({
		author: nullable(
			object({
				name: optional(string()),
				email: optional(string()),
			}),
		),
		committer: nullable(
			object({
				name: optional(string()),
				email: optional(string()),
			}),
		),
		message: string(),
	}),
})
