import type { SemanticVersionString } from "#types/SemanticVersionString"
import { version } from "#utilities/../../package.json" with { type: "json" }

export type PackageJsonVersion = SemanticVersionString

export function getPackageJsonVersion(): PackageJsonVersion {
	// Vite inlines the `version` string imported from `package.json`.
	return version as SemanticVersionString
}
