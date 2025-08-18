import { join as joinPath, resolve as resolvePath } from "node:path"
import { env } from "node:process"
import { fileURLToPath } from "node:url"
import type { ViteUserConfig as ViteConfig } from "vitest/config"
import packageJson from "./package.json" with { type: "json" }

export default {
	build: {
		emptyOutDir: Boolean(env.VITE_TARGET_PLATFORM), // Prevent the `build_legacy_v1` task from deleting the `dist/cli` and `dist/gha` directories.
		minify: "esbuild" as const,
		reportCompressedSize: false,
		rollupOptions: {
			output: {
				entryFileNames: env.VITE_TARGET_PLATFORM ? "index.js" : "main.mjs",
			},
		},
		target: "es2022",
	},
	cacheDir: path("node_modules/.cache/"),
	plugins: [],
	resolve: {
		alias: [{ find: /^#(.+)/, replacement: path("src/$1") }],
	},
	ssr: {
		noExternal: Object.keys(packageJson.dependencies), // Inline production dependencies into the build artefacts to produce a standalone executable that runs without installing `node_modules`.
	},
	test: {
		include: ["src/**/*.tests.ts"],
		mockReset: true,
	},
} satisfies ViteConfig

/**
 * Resolves a path relative to the project directory.
 */
function path(pathname: string): string {
	const projectDirectory = joinPath(fileURLToPath(import.meta.url), "..")
	return resolvePath(projectDirectory, pathname)
}
