// biome-ignore-all lint/suspicious/noConsole: Using `console` is intentional in this file.

import type { CometPlatform } from "#utilities/platform/CometPlatform.ts"

export function printMessage(message: string): void {
	console.log(message)
}

/**
 * @see https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#setting-an-error-message
 * @see https://github.com/actions/toolkit/issues/193
 */
export function printError(message: string): void {
	const platform: CometPlatform = import.meta.env.COMET_PLATFORM

	switch (platform) {
		case "cli": {
			console.error(message)
			break
		}
		case "gha": {
			const escapedMessage = message
				.replaceAll("%", "%25")
				.replaceAll("\r", "%0D")
				.replaceAll("\n", "%0A")

			console.log(`::error::${escapedMessage}`)
			break
		}
		default: {
			throw new Error("Environment variable 'COMET_PLATFORM' is undefined")
		}
	}
}
