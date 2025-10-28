import { beforeEach, vi } from "vitest"
import type { HttpMethod } from "#types/HttpMethod.ts"
import {
	HTTP_200_OK,
	HTTP_301_MOVED_PERMANENTLY,
	type HttpStatusCode,
	httpStatusTextFromCode,
} from "#types/HttpStatusCode.ts"
import type { JsonValue } from "#types/JsonValue.ts"
import { assertNotNullish } from "#utilities/Assertions.ts"
import { deepEquals } from "#utilities/Comparisons.ts"

const responsesByUrl: Map<
	`${HttpMethod} ${string}`,
	Array<{
		request: Omit<RequestOptions, "method">
		response: Response
	}>
> = new Map()

type RequestOptions = {
	headers?: Record<string, string>
	method?: HttpMethod
}

beforeEach(() => {
	responsesByUrl.clear()
	vi.stubGlobal(
		"fetch",
		async (url: string, options?: RequestOptions): ReturnType<typeof fetch> =>
			getResponseByUrl(url, options),
	)
})

const indent = "  "

function getResponseByUrl(url: string, options: RequestOptions = {}): Response {
	const { headers: actualHeaders, method: actualMethod = "GET" } = options

	const potentialResponses =
		responsesByUrl.get(`${actualMethod} ${url}`) ??
		responsesByUrl.get(`${actualMethod} ${trimQueryString(url)}`) ??
		null

	if (potentialResponses === null) {
		throw new Error(
			`Unexpected ${actualMethod} request to ${url}\n\nExpected requests in the scope of this test case:\n${getExpectedRequests()}\n\n`,
		)
	}

	const matchingResponse =
		potentialResponses.find(({ request }) =>
			deepEquals(actualHeaders, request.headers),
		)?.response ?? null

	if (matchingResponse !== null) {
		return matchingResponse
	}

	throw new Error(
		`Unexpected headers in ${actualMethod} request to ${url}:\n${indent}${JSON.stringify(actualHeaders)}\n\nExpected headers in the scope of this test case:\n${getExpectedRequestHeaders(potentialResponses)}\n\n`,
	)
}

function trimQueryString(url: string): string {
	const queryStringIndex = url.indexOf("?")
	return queryStringIndex !== -1 ? url.slice(0, queryStringIndex) : url
}

function getExpectedRequests(): string {
	return Array.from(responsesByUrl.keys())
		.filter(Boolean)
		.map((key) => `${indent}${key}`)
		.join("\n")
}

function getExpectedRequestHeaders(
	expectedRequests: Array<{
		request: Omit<RequestOptions, "method">
	}>,
): string {
	return expectedRequests
		.map(({ request }) => `${indent}${JSON.stringify(request.headers)}`)
		.join("\n")
}

export function mockFetchableJsonResource(
	request: {
		url: string
		headers?: Record<string, string>
	},
	response: {
		body: JsonValue
		statusCode?: HttpStatusCode
		headers?: Record<string, string>
	},
): void {
	const method = "GET"
	const url = request.url

	const key = `${method} ${url}` as const

	const {
		body: responseBody,
		statusCode = HTTP_200_OK,
		headers: responseHeaders = {},
	} = response

	if (!responsesByUrl.has(key)) {
		responsesByUrl.set(key, [])
	}

	const existingResponses = responsesByUrl.get(key)
	assertNotNullish(existingResponses)

	const responseJsonString = JSON.stringify(responseBody)

	existingResponses.push({
		request: {
			headers: toLowercaseHeaderNames(request.headers),
		},
		response: {
			url,
			ok: statusCode < HTTP_301_MOVED_PERMANENTLY,
			redirected: false,
			status: statusCode,
			statusText: httpStatusTextFromCode(statusCode),
			type: "basic",
			headers: new Headers({
				"content-type": "application/json",
				"content-length": `${responseJsonString.length}`,
				...toLowercaseHeaderNames(responseHeaders),
			}),
			body: null,
			bodyUsed: false,
			json: async () => responseBody,
			text: async () => responseJsonString,
			arrayBuffer: () => {
				throw new Error("Not implemented")
			},
			blob: () => {
				throw new Error("Not implemented")
			},
			bytes: () => {
				throw new Error("Not implemented")
			},
			formData: () => {
				throw new Error("Not implemented")
			},
			clone: () => {
				throw new Error("Not implemented")
			},
		},
	})
}

function toLowercaseHeaderNames(
	headers: Record<string, string> = {},
): Record<string, string> {
	return Object.fromEntries(
		Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
	)
}
