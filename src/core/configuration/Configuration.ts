export type RawConfiguration = {
	/* eslint-disable typescript/naming-convention -- The configuration properties match the rule keys. */
	readonly "no-trailing-punctuation-in-subject-lines": {
		readonly whitelist: string
	}
	/* eslint-enable typescript/naming-convention */
}

export type Configuration = {
	/* eslint-disable typescript/naming-convention -- The configuration properties match the rule keys. */
	readonly "no-trailing-punctuation-in-subject-lines": {
		readonly whitelist: ReadonlyArray<string>
	}
	/* eslint-enable typescript/naming-convention */
}

export function parseConfiguration(
	rawConfiguration: RawConfiguration,
): Configuration {
	return {
		"no-trailing-punctuation-in-subject-lines":
			parseConfigurationForNoTrailingPunctuationInSubjectLines(
				rawConfiguration["no-trailing-punctuation-in-subject-lines"],
			),
	}
}

function parseConfigurationForNoTrailingPunctuationInSubjectLines(
	rawConfiguration: RawConfiguration["no-trailing-punctuation-in-subject-lines"],
): Configuration["no-trailing-punctuation-in-subject-lines"] {
	const whitelist = rawConfiguration.whitelist
		.split(" ")
		.filter((suffix) => suffix !== "")

	return { whitelist }
}
