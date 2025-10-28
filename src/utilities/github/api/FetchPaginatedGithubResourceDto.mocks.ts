import { mockFetchableJsonResource } from "#utilities/http/Fetch.mocks.ts"
import type { JsonValue } from "#types/JsonValue.ts"
import { notNullish, splitToChunks } from "#utilities/Arrays.ts"
import type { GithubUrlString } from "#utilities/github/api/GithubUrlString.ts"
import { githubEnv } from "#utilities/github/env/GithubEnv.ts"

export function mockPaginatedGithubResourceDto<Dto extends JsonValue>(
	url: `${GithubUrlString}/${string}`,
	items: Array<Dto>,
	options: { pageSize?: number } = {},
): void {
	const { pageSize = 30 } = options

	if (items.length === 0) {
		mockFetchableJsonResource(
			{ url, headers: expectedRequestHeaders() },
			{
				body: [],
				headers: {
					link: linkHeader({ url, pageSize, pageNumber: 1, pageCount: 1 }),
				},
			},
		)
		return
	}

	const pages = Array.from(splitToChunks(items, pageSize))
	const pageCount = pages.length

	for (const [index, page] of Object.entries(pages)) {
		const pageNumber = Number.parseInt(index, 10) + 1

		mockFetchableJsonResource(
			{
				url:
					pageNumber === 1
						? url
						: `${url}?per_page=${pageSize}&page=${pageNumber}`,
				headers: expectedRequestHeaders(),
			},
			{
				body: page,
				headers: {
					link: linkHeader({ url, pageSize, pageNumber, pageCount }),
				},
			},
		)
	}
}

function linkHeader(props: {
	url: `${GithubUrlString}/${string}`
	pageSize: number
	pageNumber: number
	pageCount: number
}): string {
	return [
		props.pageNumber > 1
			? `<${props.url}?per_page=${props.pageSize}&page=${props.pageNumber - 1}>; rel="prev"`
			: null,
		props.pageNumber < props.pageCount
			? `<${props.url}?per_page=${props.pageSize}&page=${props.pageNumber + 1}>; rel="next"`
			: null,
		`<${props.url}?per_page=${props.pageSize}&page=${props.pageCount}>; rel="last"`,
		`<${props.url}?per_page=${props.pageSize}&page=1>; rel="first"`,
	]
		.filter(notNullish)
		.join(", ")
}

export function mockNonexistingGithubResourceDto(
	url: `${GithubUrlString}/${string}`,
	props: {
		documentationUrl: string
	},
): void {
	mockFetchableJsonResource(
		{ url, headers: expectedRequestHeaders() },
		{
			body: {
				message: "Not Found",
				documentation_url: props.documentationUrl,
				status: "404",
			},
			statusCode: 404,
		},
	)
}

function expectedRequestHeaders(): Record<string, string> {
	const env = githubEnv()
	return {
		accept: "application/vnd.github+json",
		authorization: `Bearer ${env.__secretToken__}`,
		"x-github-api-version": "2022-11-28",
	}
}
