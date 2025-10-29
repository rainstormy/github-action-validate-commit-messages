import { type InferOutput, is, object } from "valibot"
import { naturalNumber } from "#types/NaturalNumber.ts"

/**
 * @see https://docs.github.com/en/webhooks/webhook-events-and-payloads#pull_request
 */
export type GithubPullRequestEventDto = InferOutput<
	ReturnType<typeof githubPullRequestEventDto>
>

export function githubPullRequestEventDto() {
	return object({
		pull_request: object({
			number: naturalNumber(1),
		}),
	})
}

export function isGithubPullRequestEventDto(
	dto: unknown,
): dto is GithubPullRequestEventDto {
	return is(githubPullRequestEventDto(), dto)
}
