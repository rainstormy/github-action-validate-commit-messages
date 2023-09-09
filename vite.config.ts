import { builtinModules } from "node:module"
import { join as joinPath, resolve as resolvePath } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"
import tsconfigJson from "./tsconfig.json"

const projectDirectory = joinPath(fileURLToPath(import.meta.url), "..")

export default defineConfig(() => ({
	build: {
		emptyOutDir: true,
		lib: {
			entry: inProjectDirectory("src/entry.actions.ts"),
			formats: ["cjs"],
			fileName: "entry.actions",
		},
		outDir: inProjectDirectory("release/"),
		reportCompressedSize: false,
		rollupOptions: {
			external: [
				...builtinModules,
				...builtinModules.map((moduleName) => `node:${moduleName}`),
			],
		},
	},
	plugins: [],
	resolve: {
		alias: getAliasesFromTsconfig(),
	},
	test: {
		coverage: {
			include: ["src/**/*.{ts,tsx}"],
			reporter: ["html"],
		},
		globals: true, // Makes test cases compatible with Jest-related tooling, such as ESLint and Testing Library (for automatic cleanup).
		include: ["src/**/*.tests.{ts,tsx}"],
	},
}))

function getAliasesFromTsconfig(): Record<string, string> {
	return Object.fromEntries(
		Object.entries(tsconfigJson.compilerOptions.paths).map(
			([alias, [path]]) => [alias, inProjectDirectory(path)],
		),
	)
}

function inProjectDirectory(relativePath: string): string {
	return resolvePath(projectDirectory, relativePath)
}
