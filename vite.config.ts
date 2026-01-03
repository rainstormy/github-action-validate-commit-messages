import { join as joinPath, resolve as resolvePath } from "node:path"
import { env } from "node:process"
import { fileURLToPath } from "node:url"
import type { ViteUserConfig as ViteConfig } from "vitest/config"

export default {
	build: {
		emptyOutDir: Boolean(env.COMET_PLATFORM), // Prevent the `build-legacy-v1` task from deleting the `dist/cli` and `dist/gha` directories.
		minify: "esbuild" as const,
		reportCompressedSize: false,
		rollupOptions: {
			output: {
				entryFileNames: env.COMET_PLATFORM ? "index.js" : "main.mjs",
			},
		},
		target: "es2022",
	},
	cacheDir: path("node_modules/.cache/"),
	envPrefix: "COMET_",
	plugins: [],
	resolve: {
		alias: [
			{
				find: /^#(legacy-v1|types|utilities)\/(.+)/,
				replacement: path("src/$1/$2"),
			},
			{ find: /^#(.+)/, replacement: path("src/domains/$1") },
		],
	},
	ssr: {
		noExternal: ["valibot"], // Inline production dependencies into the build artefacts to produce a standalone executable that runs without installing `node_modules`.
	},
	test: {
		include: ["src/**/*.tests.ts"],
		pool: "vmThreads",
		setupFiles: ["src/utilities/vitest/VitestSetup.mocks.ts"],
		mockReset: true,
		unstubEnvs: true,
		unstubGlobals: true,
	},
} satisfies ViteConfig

/**
 * Resolves a path relative to the project directory.
 */
function path(pathname: string): string {
	const projectDirectory = joinPath(fileURLToPath(import.meta.url), "..")
	return resolvePath(projectDirectory, pathname)
}
