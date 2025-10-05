import { beforeEach, vi } from "vitest"
import type { JsonValue } from "#types/JsonValue.ts"
import type { ModuleMock } from "#types/ModuleMock.ts"

const contentsByPath: Map<string, JsonValue> = vi.hoisted(
	() => new Map<string, JsonValue>(),
)

const mock: FilesMock = vi.hoisted(
	(): FilesMock => ({
		readJsonFile: vi.fn(async (path) => {
			const content = contentsByPath.get(path) ?? null

			if (content === null) {
				throw new Error(`Failed to read ${path}: File not found`)
			}

			return content
		}),
	}),
)

export type FilesMock = ModuleMock<
	typeof import("#utilities/files/Files") // CAUTION: `vi.mock()` below must always refer to the same path as here.
>

vi.mock("#utilities/files/Files", () => mock)

beforeEach(() => {
	contentsByPath.clear()
})

export function injectJsonFile(path: string, content: JsonValue): void {
	contentsByPath.set(path, content)
}

export function injectNonexistingFile(path: string): void {
	contentsByPath.delete(path)
}
