import {
	type InferOutput,
	integer,
	minValue,
	number,
	object,
	pipe,
} from "valibot"

/**
 * @see https://docs.github.com/en/webhooks/webhook-events-and-payloads#pull_request
 */
export type GithubActionsPullRequestEventDto = InferOutput<
	typeof githubActionsPullRequestEventDtoSchema
>

export const githubActionsPullRequestEventDtoSchema = object({
	pull_request: object({
		number: pipe(number(), minValue(1), integer()),
	}),
})
