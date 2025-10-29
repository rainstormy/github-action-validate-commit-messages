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
	ReturnType<typeof githubPullRequestEventDto>
>

export function githubPullRequestEventDto() {
	return object({
		pull_request: object({
			number: pipe(number(), minValue(1), integer()),
		}),
	})
}

export function isGithubPullRequestEventDto(
	dto: unknown,
): dto is GithubPullRequestEventDto {
	return is(githubPullRequestEventDto(), dto)
}
