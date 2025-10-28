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
	typeof import("#utilities/files/Files.ts") // CAUTION: `vi.mock()` below must always refer to the same path as here.
>

vi.mock("#utilities/files/Files.ts", () => mock)

export function mockFiles(): FilesMock {
	beforeEach(() => {
		contentsByPath.clear()
	})
	return mock
}

export function mockJsonFile(path: string, content: JsonValue): void {
	contentsByPath.set(path, content)
}

export function mockNonexistingFile(path: string): void {
	contentsByPath.delete(path)
}
