// biome-ignore lint/correctness/noNodejsModules: This file needs access to environment variables.
import { env } from "node:process"

export type GithubEnv = {
	eventPath: string
}

let cachedEnv: GithubEnv | null = null

/**
 * @see https://docs.github.com/en/actions/reference/workflows-and-actions/variables
 */
export function githubEnv(): GithubEnv {
	if (cachedEnv !== null) {
		return cachedEnv
	}

	cachedEnv = {
		eventPath: getEnvString("GITHUB_EVENT_PATH"),
	}

	return cachedEnv
}

function getEnvString(key: `GITHUB_${string}`): string {
	const value = env[key]

	if (!value) {
		throw new Error(`Expected the environment variable '${key}' to be defined`)
	}

	return value
}
