import { readFile } from "node:fs/promises"
import { githubActionsEventPath } from "+adapters/gha/GithubActionsEnv"
import {
	type GithubActionsPullRequestEventDto,
	githubActionsPullRequestEventDtoSchema,
} from "+adapters/gha/event/dtos/GithubActionsPullRequestEventDto"
import { parse } from "valibot"

/**
 * @see https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables
 */
export async function fetchGithubActionsPullRequestEventDto(): Promise<GithubActionsPullRequestEventDto> {
	const path = githubActionsEventPath()
	const content = await readFile(path, "utf8")

	return parse(githubActionsPullRequestEventDtoSchema, JSON.parse(content))
}
