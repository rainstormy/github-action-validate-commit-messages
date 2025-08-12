import { vi } from "vitest"
import type { ModuleMock } from "#types/ModuleMock"

export type PackageJsonVersionMock = ModuleMock<
	typeof import("#utilities/packagejson/PackageJsonVersion") // CAUTION: `vi.mock()` below must always refer to the same path as here.
>

export function injectPackageJsonVersionMock(): PackageJsonVersionMock {
	const mock = vi.hoisted<PackageJsonVersionMock>(() => ({
		getPackageJsonVersion: vi.fn(),
	}))

	vi.mock("#utilities/packagejson/PackageJsonVersion", () => mock)
	return mock
}
