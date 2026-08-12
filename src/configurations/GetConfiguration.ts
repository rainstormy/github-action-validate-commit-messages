import type { Configuration } from "#configurations/Configuration.ts"

export async function getConfiguration(
	defaultConfiguration: Configuration,
): Promise<Configuration> {
	return { ...defaultConfiguration }
}
