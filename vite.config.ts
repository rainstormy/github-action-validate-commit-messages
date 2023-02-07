import { join as joinPath, resolve as resolvePath } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const projectDirectory = joinPath(fileURLToPath(import.meta.url), "..")

const viteConfig = defineConfig(() => ({
	build: {
		emptyOutDir: true,
		lib: {
			entry: inProjectDirectory("src/sample.ts"),
			formats: ["cjs"],
			fileName: "index",
		},
		outDir: inProjectDirectory("build"),
		reportCompressedSize: false,
	},
	plugins: [],
	resolve: {
		alias: {},
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
