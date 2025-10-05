import type { JsonValue } from "#types/JsonValue"
import { notNullish, splitToChunks } from "#utilities/Arrays"
import type { GithubPaginatedResourceString } from "#utilities/github/api/FetchPaginatedGithubDto"
import { githubEnv } from "#utilities/github/env/GithubEnv"
import { injectFetchableJsonResource } from "#utilities/http/Fetch.fixtures"

const pageSizeRegex = /\?per_page=<(?<perPage>\d+)>&/

export function injectPaginatedGithubDto<Dto extends JsonValue>(
	resource: GithubPaginatedResourceString,
	items: Array<Dto>,
): void {
	const env = githubEnv()
	const expectedRequestHeaders: Record<string, string> = {
		accept: "application/vnd.github+json",
		authorization: `Bearer ${env.__secretToken__}`,
		"x-github-api-version": "2022-11-28",
	}

	const perPage = pageSizeRegex.exec(resource)?.groups?.pageSize ?? "30"
	const pageSize = Number.parseInt(perPage, 10)

	const pages = Array.from(splitToChunks(items, pageSize))

	if (pages.length === 0) {
		injectFetchableJsonResource(
			{
				url: resource,
				headers: expectedRequestHeaders,
			},
			{
				body: [],
				headers: {
					link: formatLinkHeader(1),
				},
			},
		)
		return
	}

	for (const [index, page] of Object.entries(pages)) {
		const pageNumber = Number.parseInt(index, 10)

		injectFetchableJsonResource(
			{
				url: `${resource}?per_page=${pageSize}&page=${pageNumber}`,
				headers: expectedRequestHeaders,
			},
			{
				body: page,
				headers: {
					link: formatLinkHeader(pageNumber),
				},
			},
		)
	}

	function formatLinkHeader(pageNumber: number): string {
		return [
			pageNumber > 1
				? `<${resource}?per_page=${pageSize}&page=${pageNumber - 1}>; rel="prev"`
				: null,
			pageNumber < pages.length
				? `<${resource}?per_page=${pageSize}&page=${pageNumber + 1}>; rel="next"`
				: null,
			`<${resource}?per_page=${pageSize}&page=${pages.length}>; rel="last"`,
			`<${resource}?per_page=${pageSize}&page=1>; rel="first"`,
		]
			.filter(notNullish)
			.join(", ")
	}
}
