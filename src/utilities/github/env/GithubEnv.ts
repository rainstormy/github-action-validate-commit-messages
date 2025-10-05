// biome-ignore lint/correctness/noNodejsModules: This file needs access to environment variables.
import process from "node:process"
import { assertHttpUrlString, type HttpUrlString } from "#types/HttpUrlString"
import { assertNonBlankString } from "#utilities/Assertions"
import type { GithubApiBaseUrlString } from "#utilities/github/api/FetchPaginatedGithubDto"

export type GithubEnv = {
	apiBaseUrl: GithubApiBaseUrlString
	eventPath: string
	__secretToken__: string
}

let cachedEnv: GithubEnv | null = null

/**
 * @see https://docs.github.com/en/actions/reference/workflows-and-actions/variables
 * @see https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax#example-specifying-inputs
 */
export function githubEnv(): GithubEnv {
	if (import.meta.env.PROD && cachedEnv !== null) {
		return cachedEnv
	}

	cachedEnv = {
		apiBaseUrl: `${envHttpUrlString("GITHUB_API_URL")}/repos/${envString("GITHUB_REPOSITORY")}`,
		eventPath: envString("GITHUB_EVENT_PATH"),
		__secretToken__: envString("INPUT_GITHUB-TOKEN"),
	}

	return cachedEnv
}

function envHttpUrlString(key: EnvKey): HttpUrlString {
	const value = process.env[key]
	assertHttpUrlString(
		value,
		() =>
			`Expected ${formatEnvKey(key)} to be a non-blank URL string, but got ${value}`,
	)

	return value
}

function envString(key: EnvKey): string {
	const value = process.env[key]
	assertNonBlankString(
		value,
		() =>
			`Expected ${formatEnvKey(key)} to be a non-blank string, but got ${value}`,
	)

	return value
}

function formatEnvKey(key: EnvKey): string {
	return isInputParameter(key)
		? `the input parameter '${nameOfInputParameter(key)}'`
		: `the environment variable '${key}'`
}

type EnvKey = `GITHUB_${string}` | `INPUT_${string}`

function isInputParameter(key: string): key is `INPUT_${string}` {
	return key.startsWith("INPUT_")
}

function nameOfInputParameter(key: `INPUT_${string}`): string {
	return key.slice("INPUT_".length).toLowerCase()
}
