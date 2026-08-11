import type { Configuration } from "#configurations/Configuration.ts"

export async function getConfiguration(
	defaultConfiguraiton: Configuration,
): Promise<Configuration> {
	return defaultConfiguraiton
}
