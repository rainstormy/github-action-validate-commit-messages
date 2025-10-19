import type { JsonValue } from "#types/JsonValue.ts"
import { readJsonFile } from "#utilities/files/Files.ts"
import { githubEnv } from "#utilities/github/env/GithubEnv.ts"

export async function fetchGithubEventDto(): Promise<JsonValue> {
	const env = githubEnv()
	return await readJsonFile(env.eventPath)
}
