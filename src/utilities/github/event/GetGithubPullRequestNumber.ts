import { isGithubPullRequestEventDto } from "#utilities/github/event/dtos/GithubPullRequestEventDto"
import { fetchGithubEventDto } from "#utilities/github/event/FetchGithubEventDto"

export async function getGithubPullRequestNumber(): Promise<number | null> {
	const dto = await fetchGithubEventDto()
	return isGithubPullRequestEventDto(dto) ? dto.pull_request.number : null
}
