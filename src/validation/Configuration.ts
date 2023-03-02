export type Configuration = {
	readonly suffixWhitelist: ReadonlyArray<string>
}

type ConfigurationProps = {
	readonly delimitedSuffixWhitelist: string
}

export function configurationFrom({
	delimitedSuffixWhitelist,
}: ConfigurationProps): Configuration {
	const suffixWhitelist = delimitedSuffixWhitelist
		.split(" ")
		.filter((suffix) => suffix !== "")

	return { suffixWhitelist }
}
