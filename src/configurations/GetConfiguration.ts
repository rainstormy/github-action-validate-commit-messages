import type { TokenConfiguration } from "#commits/TokenConfiguration.ts"
import type { RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"

export type Configuration = {
	rules: RulesetConfiguration
	tokens: TokenConfiguration
}

export async function getConfiguration(
	defaultConfiguration: Configuration,
): Promise<Configuration> {
	return { ...defaultConfiguration }
}
