import type { Configuration } from "#configurations/Configuration"
import { getDefaultConfiguration } from "#configurations/GetDefaultConfiguration"

export async function getConfiguration(): Promise<Configuration> {
	return getDefaultConfiguration()
}
