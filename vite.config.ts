import { join as joinPath, resolve as resolvePath } from "node:path"
import { fileURLToPath } from "node:url"
import { type ViteUserConfig as ViteConfig, defineConfig } from "vitest/config"
import tsconfigJson from "./tsconfig.json" assert { type: "json" }

const projectDirectory = joinPath(fileURLToPath(import.meta.url), "..")

export default defineConfig(() => {
	const baseConfiguration: ViteConfig = {
		build: {
			emptyOutDir: true,
			minify: "esbuild" as const,
			reportCompressedSize: false,
			rollupOptions: {
				output: {
					entryFileNames: "main.mjs",
				},
			},
		},
		cacheDir: inProjectDirectory("node_modules/.cache/"),
		plugins: [],
		resolve: {
			alias: tsconfigPathAliases(),
		},
		ssr: {
			noExternal: ["@actions/core", "@actions/github", "undici", "valibot"],
		},
		test: {
			coverage: {
				include: ["src/**/*.ts"],
				exclude: ["src/**/*.tests.ts"],
				provider: "v8" as const,
				reportsDirectory: inProjectDirectory(
					"node_modules/.cache/vitest/coverage/",
				),
			},
			include: ["src/**/*.tests.ts"],
		},
	}

	return baseConfiguration
})

function tsconfigPathAliases(): Record<string, string> {
	return Object.fromEntries(
		Object.entries(tsconfigJson.compilerOptions.paths).map((entry) => {
			assertSinglePath(entry)
			const [alias, [path]] = entry
			return [
				alias.slice(0, -"/*".length),
				inProjectDirectory(path.slice(0, -"/*".length)),
			]
		}),
	)
}

function assertSinglePath(
	entry: [alias: string, paths: Array<string>],
): asserts entry is [alias: string, paths: [string]] {
	const [alias, paths] = entry
	if (paths.length !== 1) {
		throw new Error(
			`Path alias '${alias}' in 'tsconfig.json' must specify exactly one path, but has ${paths.length} paths`,
		)
	}
}

function inProjectDirectory(relativePath: string): string {
	return resolvePath(projectDirectory, relativePath)
}
