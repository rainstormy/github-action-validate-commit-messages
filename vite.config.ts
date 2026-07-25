import { env } from "node:process"
import { defineOxfmtConfig } from "@rainstormy/presets-web/oxfmt"
import { defineOxlintConfig, oxlintRestrictedImportPatterns } from "@rainstormy/presets-web/oxlint"
import { defineConfig } from "vite-plus"

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
	envPrefix: "COMET_",
	fmt: defineOxfmtConfig({ ignorePatterns: ["dist/**/*", "**/*.md"] }),
	lint: defineOxlintConfig({
		ignorePatterns: ["dist/**/*"],
		overrides: [
			{
				files: [
					"src/main-*.ts",
					"src/legacy-v1/adapters/gha/LegacyV1GithubActionsConfiguration.ts",
					"src/utilities/files/Files.ts",
					"src/utilities/git/cli/RunGitCommand.ts",
					"src/utilities/github/env/GithubEnv.ts",
				],
				rules: {
					"eslint/no-restricted-imports": [
						"warn",
						{ patterns: oxlintRestrictedImportPatterns({ allowNodejs: true }) },
					],
				},
			},
		],
	}),
	run: {
		tasks: {
			build: {
				// language=sh
				command: [
					"COMET_PLATFORM='cli' vite build --ssr src/main-cli.ts --outDir dist/cli/",
					"COMET_PLATFORM='gha' vite build --ssr src/main-gha.ts --outDir dist/gha/",
					"vite build --ssr src/main-legacy-v1.ts --outDir dist/",
				],
				input: [{ auto: true }, "!dist/**/*"],
			},
			check: {
				// language=sh
				command: "vp check",
			},
			fmt: {
				// language=sh
				command: "vp check --fix",
			},
			install: {
				// language=sh
				command: [
					"vp install --frozen-lockfile --ignore-scripts",
					'if [ "$LEFTHOOK" != "0" ]; then lefthook install; fi',
				],
				cache: false,
			},
			test: {
				// language=sh
				command: "vp test",
				input: [{ auto: true }, "!node_modules/.vite-temp/vite.config.ts.timestamp-*"],
			},
			yolo: {
				// language=sh
				command: "lefthook uninstall",
				cache: false,
			},
		},
	},
	ssr: {
		noExternal: ["valibot"], // Inline production dependencies into the build artefacts to produce a standalone executable that runs without installing `node_modules`.
	},
	test: {
		include: ["src/**/*.tests.ts"],
		pool: "vmThreads",
		setupFiles: ["src/utilities/vitest/VitestSetup.fakes.ts"],
		mockReset: true,
		unstubEnvs: true,
		unstubGlobals: true,
	},
})
