import { array, type GenericSchema, type InferOutput, parse } from "valibot"
import type { HttpUrlString } from "#types/HttpUrlString"
import { githubEnv } from "#utilities/github/env/GithubEnv"

export type GithubPaginatedResourceString =
	`${GithubApiBaseUrlString}/${string}?per_page=${number}&page=${number}`

export type GithubApiBaseUrlString = `${HttpUrlString}/repos/${string}`

const nextPageRegex = /<(?<resource>\S*)>; rel="next"/i

/**
 * @see https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28#example-creating-a-pagination-method
 */
export async function fetchPaginatedGithubDto<Schema extends GenericSchema>(
	resource: GithubPaginatedResourceString,
	schema: Schema,
): Promise<Array<InferOutput<Schema>>> {
	const env = githubEnv()

	const arraySchema = array(schema)
	const deferredCheckedPages: Array<Promise<Array<InferOutput<Schema>>>> = []

	let nextResource: string | null = resource

	while (nextResource !== null) {
		// biome-ignore lint/performance/noAwaitInLoops: The paginated API makes each loop iteration depend on the result of the previous iteration.
		const response: Response = await fetch(nextResource, {
			headers: {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${env.__secretToken__}`,
				"x-github-api-version": "2022-11-28",
			},
		})

		if (!response.ok) {
			throw new Error(
				`Failed to fetch '${nextResource}': ${response.status} ${response.statusText}`,
			)
		}

		deferredCheckedPages.push(
			response.json().then((data: unknown) => parse(arraySchema, data)),
		)

		const link = response.headers.get("link")
		const nextPageMatch = link ? nextPageRegex.exec(link) : null

		nextResource = nextPageMatch?.groups?.resource ?? null
	}

	const checkedPages = await Promise.all(deferredCheckedPages)
	return checkedPages.flat()
}
