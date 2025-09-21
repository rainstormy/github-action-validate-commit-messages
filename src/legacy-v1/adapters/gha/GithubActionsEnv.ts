import process from "node:process"

/**
 * @see https://docs.github.com/en/actions/sharing-automations/creating-actions/metadata-syntax-for-github-actions#example-specifying-inputs
 * @see https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepswith
 */
export function githubActionsStringInput(key: string): string {
	return process.env[`INPUT_${key.toUpperCase()}`] ?? ""
}

/**
 * @see https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables
 */
export function githubActionsApiBaseUrl(): string {
	const apiBaseUrl = process.env.GITHUB_API_URL

	if (!apiBaseUrl) {
		throw new Error(
			"Expected the environment variable 'GITHUB_API_URL' to be defined by the GitHub Actions runner",
		)
	}

	return apiBaseUrl
}

/**
 * @see https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables
 */
export function githubActionsRepository(): string {
	const repository = process.env.GITHUB_REPOSITORY

	if (!repository) {
		throw new Error(
			"Expected the environment variable 'GITHUB_REPOSITORY' to be defined by the GitHub Actions runner",
		)
	}

	return repository
}
