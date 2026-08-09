import * as v from "valibot"
import { naturalNumber } from "#types/NaturalNumber.ts"

/**
 * @see https://docs.github.com/en/webhooks/webhook-events-and-payloads#pull_request
 */
export type GithubPullRequestEventDto = v.InferOutput<ReturnType<typeof githubPullRequestEventDto>>

// oxlint-disable-next-line typescript/explicit-function-return-type -- Rely on type inference for Valibot schemas.
export function githubPullRequestEventDto() {
	return v.object({
		pull_request: v.object({
			number: naturalNumber(),
		}),
	})
}

export function isGithubPullRequestEventDto(dto: unknown): dto is GithubPullRequestEventDto {
	return v.is(githubPullRequestEventDto(), dto)
}
