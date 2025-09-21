import type { JsonValue } from "#types/JsonValue"
import { readJsonFile } from "#utilities/files/Files"
import { githubEnv } from "#utilities/github/env/GithubEnv"

export async function fetchGithubEventDto(): Promise<JsonValue> {
	const env = githubEnv()
	return await readJsonFile(env.eventPath)
}
