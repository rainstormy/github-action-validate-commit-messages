import type { Configuration } from "#configurations/Configuration.ts"
import { getDefaultConfiguration } from "#configurations/GetDefaultConfiguration.ts"

export async function getConfiguration(): Promise<Configuration> {
	return getDefaultConfiguration()
}
