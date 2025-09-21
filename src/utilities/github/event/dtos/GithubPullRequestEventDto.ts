import {
	type InferOutput,
	integer,
	is,
	minValue,
	number,
	object,
	pipe,
} from "valibot"

/**
 * @see https://docs.github.com/en/webhooks/webhook-events-and-payloads#pull_request
 */
export type GithubPullRequestEventDto = InferOutput<
	typeof GITHUB_PULL_REQUEST_EVENT_DTO_SCHEMA
>

export const GITHUB_PULL_REQUEST_EVENT_DTO_SCHEMA = object({
	pull_request: object({
		number: pipe(number(), minValue(1), integer()),
	}),
})

export function isGithubPullRequestEventDto(
	dto: unknown,
): dto is GithubPullRequestEventDto {
	return is(GITHUB_PULL_REQUEST_EVENT_DTO_SCHEMA, dto)
}
