// biome-ignore lint/correctness/noNodejsModules: This file needs access to the file system.
import { readFile } from "node:fs/promises"
import type { JsonValue } from "#types/JsonValue.ts"
import { assertError } from "#utilities/Assertions.ts"

export async function readJsonFile(path: string): Promise<JsonValue> {
	try {
		const content = await readFile(path, "utf8")
		return JSON.parse(content)
	} catch (error) {
		assertError(error)
		throw new Error(`Failed to read ${path}: ${error.message}`)
	}
}
