import { env } from "node:process"
import { defineConfig } from "vitest/config"

export default defineConfig({
	build: {
		emptyOutDir: Boolean(env.COMET_PLATFORM), // Prevent the `build-legacy-v1` task from deleting the `dist/cli` and `dist/gha` directories.
		minify: "oxc",
		reportCompressedSize: false,
		rolldownOptions: {
			output: {
				entryFileNames: env.COMET_PLATFORM !== undefined ? "index.js" : "main.mjs",
			},
		},
		target: "es2022",
	},
	cacheDir: "node_modules/.cache/",
	envPrefix: "COMET_",
	plugins: [],
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
})
