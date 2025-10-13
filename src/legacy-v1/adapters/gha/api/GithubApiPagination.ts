import { githubActionsStringInput } from "#legacy-v1/adapters/gha/GithubActionsEnv.ts"

const nextPageRegex = /<(?<resource>\S*)>; rel="next"/i

/**
 * @see https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28#example-creating-a-pagination-method
 */
export async function paginatedGithubFetch(
	resource: string,
): Promise<Array<unknown>> {
	const paginatedResults: Array<unknown> = []

	const __secretGithubToken__ = githubActionsStringInput("github-token")

	if (!__secretGithubToken__) {
		throw new Error("Input parameter 'github-token' must be specified")
	}

	let nextResource: string | null = resource

	while (nextResource !== null) {
		// biome-ignore lint/performance/noAwaitInLoops: The paginated API makes each loop iteration depend on the result of the previous iteration.
		const response: Response = await fetch(nextResource, {
			headers: {
				Accept: "application/vnd.github+json",
				Authorization: `Bearer ${__secretGithubToken__}`,
				"X-GitHub-Api-Version": "2022-11-28",
			},
		})

		if (!response.ok) {
			throw new Error(
				`Failed to fetch '${nextResource}': ${response.status} ${response.statusText}`,
			)
		}

		const data = await response.json()
		paginatedResults.push(data)

		const link = response.headers.get("link")
		const nextPageMatch = link ? nextPageRegex.exec(link) : null

		nextResource = nextPageMatch?.groups?.resource ?? null
	}

	return paginatedResults
}
