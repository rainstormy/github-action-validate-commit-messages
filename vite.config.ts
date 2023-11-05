import { join as joinPath, resolve as resolvePath } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"
import tsconfigJson from "./tsconfig.json"

const projectDirectory = joinPath(fileURLToPath(import.meta.url), "..")

export default defineConfig(() => ({
	build: {
		emptyOutDir: true,
		minify: "esbuild" as const,
		reportCompressedSize: false,
	},
	plugins: [],
	resolve: {
		alias: getAliasesFromTsconfig(),
	},
	ssr: {
		noExternal: ["@actions/core", "@actions/github", "undici", "zod"],
	},
	test: {
		coverage: {
			include: ["src/**/*.ts"],
			exclude: ["src/**/*.tests.ts"],
			provider: "v8" as const,
			reportsDirectory: inProjectDirectory("node_modules/.vitest/coverage"),
		},
		globals: true, // Makes test cases compatible with Jest-related tooling, such as ESLint and Testing Library (for automatic cleanup).
		include: ["src/**/*.tests.ts"],
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
