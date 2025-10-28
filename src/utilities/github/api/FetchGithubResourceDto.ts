import { array, type GenericSchema, type InferOutput, parse } from "valibot"
import type { GithubUrlString } from "#utilities/github/api/GithubUrlString.ts"
import { githubEnv } from "#utilities/github/env/GithubEnv.ts"

const nextPageRegex = /<(?<nextResourceUrl>\S*)>; rel="next"/i

/**
 * Retrieves a paginated resource from the GitHub API and returns a flattened array.
 *
 * @see https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28#example-creating-a-pagination-method
 */
export async function fetchGithubResourceDto<Schema extends GenericSchema>(
	resourceUrl: `${GithubUrlString}/${string}`,
	schema: Schema,
): Promise<Array<InferOutput<Schema>>> {
	const env = githubEnv()

	const arraySchema = array(schema)
	const deferredCheckedPages: Array<Promise<Array<InferOutput<Schema>>>> = []

	let nextResourceUrl: string | null = resourceUrl

	while (nextResourceUrl !== null) {
		// biome-ignore lint/performance/noAwaitInLoops: The paginated API makes each loop iteration depend on the result of the previous iteration.
		const response: Response = await fetch(nextResourceUrl, {
			headers: {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${env.__secretToken__}`,
				"x-github-api-version": "2022-11-28",
			},
		})

		if (!response.ok) {
			throw new Error(
				`Failed to fetch '${nextResourceUrl}': ${response.status} ${response.statusText}`,
			)
		}

		deferredCheckedPages.push(
			response.json().then((data: unknown) => parse(arraySchema, data)),
		)

		const link = response.headers.get("link")
		const nextPageMatch = link ? nextPageRegex.exec(link) : null

		nextResourceUrl = nextPageMatch?.groups?.nextResourceUrl ?? null
	}

	const checkedPages = await Promise.all(deferredCheckedPages)
	return checkedPages.flat()
}
