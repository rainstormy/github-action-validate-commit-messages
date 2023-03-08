import { builtinModules } from "node:module"
import { join as joinPath, resolve as resolvePath } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const projectDirectory = joinPath(fileURLToPath(import.meta.url), "..")

const viteConfig = defineConfig(() => ({
	build: {
		emptyOutDir: true,
		lib: {
			entry: inProjectDirectory("src/entry.actions.ts"),
			formats: ["cjs"],
			fileName: "index",
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
		// The first alias takes precedence over the following ones.
		alias: {
			"+core": inProjectDirectory("src/core/index"),
			"+github": inProjectDirectory("src/github/index"),
			"+rules": inProjectDirectory("src/rules/index"),
			"+utilities": inProjectDirectory("src/utilities/index"),
			"+validation": inProjectDirectory("src/validation/index"),
		},
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

function inProjectDirectory(relativePath: string): string {
	return resolvePath(projectDirectory, relativePath)
}

export default viteConfig
