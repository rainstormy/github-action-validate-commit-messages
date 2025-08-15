/**
 * @see https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#setting-an-error-message
 * @see https://github.com/actions/toolkit/issues/193
 */
export function printGithubActionsError(message: string): void {
	const escapedMessage = message
		.replaceAll("%", "%25")
		.replaceAll("\r", "%0D")
		.replaceAll("\n", "%0A")

	// biome-ignore lint/suspicious/noConsole: Using `console` is intentional in this case.
	console.log(`::error::${escapedMessage}`)
}
