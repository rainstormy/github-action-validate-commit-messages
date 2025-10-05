// biome-ignore lint/correctness/noNodejsModules: This file needs access to environment variables.
import process from "node:process"
import {
	type HttpUrlString,
	requireHttpUrlString,
} from "#types/HttpUrlString.ts"
import { requireNotBlankString } from "#utilities/Assertions.ts"
import type { GithubUrlString } from "#utilities/github/api/GithubUrlString.ts"

export type GithubEnv = {
	apiBaseUrl: GithubUrlString
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
	return requireHttpUrlString(
		process.env[key],
		(invalidValue) =>
			`Expected the environment variable '${key}' to be a URL string, but got '${invalidValue}'`,
	)
}

function envString(key: EnvKey): string {
	return requireNotBlankString(process.env[key], () =>
		isInputParameter(key)
			? `The 'rainstormy/comet' action expects the '${nameOfInputParameter(key)}' input parameter to be set`
			: `Expected the environment variable '${key}' to be set`,
	)
}

type EnvKey = `GITHUB_${string}` | `INPUT_${string}`

function isInputParameter(key: string): key is `INPUT_${string}` {
	return key.startsWith("INPUT_")
}

function nameOfInputParameter(key: `INPUT_${string}`): string {
	return key.slice("INPUT_".length).toLowerCase()
}
