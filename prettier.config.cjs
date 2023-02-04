/**
 * @type {import("prettier").Config}
 * @see https://prettier.io/docs/en/configuration.html
 */
const prettierConfig = {
	// The plugins must be listed explicitly for them to work with Yarn:
	// https://github.com/prettier/prettier/issues/8474
	plugins: [],
	semi: false,
	trailingComma: "all",
}

module.exports = prettierConfig
