import type { Configuration, RawConfiguration } from "+core"

export const dummyRawConfiguration: RawConfiguration = {
	"no-trailing-punctuation-in-subject-lines": {
		whitelist: "",
	},
}

export function dummyRawConfigurationFor<
	RuleKey extends keyof RawConfiguration,
>(
	rule: RuleKey,
	overrides: Partial<RawConfiguration[RuleKey]>,
): RawConfiguration {
	return {
		...dummyRawConfiguration,
		[rule]: {
			...dummyRawConfiguration[rule],
			...overrides,
		},
	}
}

export const dummyConfiguration: Configuration = {
	"no-trailing-punctuation-in-subject-lines": {
		whitelist: [],
	},
}

export function dummyConfigurationFor<RuleKey extends keyof Configuration>(
	rule: RuleKey,
	overrides: Partial<Configuration[RuleKey]>,
): Configuration {
	return {
		...dummyConfiguration,
		[rule]: {
			...dummyConfiguration[rule],
			...overrides,
		},
	}
}
