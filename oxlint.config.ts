import { defineOxlintConfig, oxlintRestrictedImportPatterns } from "@rainstormy/presets-web/oxlint"

export default defineOxlintConfig({
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
})
