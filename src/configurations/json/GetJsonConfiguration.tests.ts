import { beforeEach, describe, expect, it } from "vitest"
import type { Configuration } from "#configurations/GetConfiguration.ts"
import { getJsonConfiguration } from "#configurations/json/GetJsonConfiguration.ts"
import type { RuleKey } from "#configurations/RulesetConfiguration.ts"
import type { JsonObject, JsonValue } from "#types/JsonValue.ts"
import { mockJsonFile } from "#utilities/files/Files.fakes.ts"
import type { DeepPartial } from "#utilities/Objects.ts"

describe("when it is empty", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {})
	})

	it("omits tokens and rules", async () => {
		const configuration = await getJsonConfiguration()
		expect(configuration).toEqual<DeepPartial<Configuration>>({
			tokens: {},
			rules: {},
		})
	})
})

describe("when there is only metadata", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			$schema: "https://example.com/schema.json",
			extends: "@rainstormy/comet-config",
		})
	})

	it("omits tokens and rules", async () => {
		const configuration = await getJsonConfiguration()
		expect(configuration).toEqual<DeepPartial<Configuration>>({
			tokens: {},
			rules: {},
		})
	})
})

describe("when it has GitHub-/GitLab-style issue link tokens", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			tokens: {
				issueLinks: {
					prefixes: ["#", "GH-", "GL-"],
				},
			},
		})
	})

	it("returns the token configuration", async () => {
		const configuration = await getJsonConfiguration()
		expect(configuration).toEqual<DeepPartial<Configuration>>({
			tokens: {
				issueLinks: {
					prefixes: ["#", "GH-", "GL-"],
					wildcards: [],
				},
			},
			rules: {},
		})
	})
})

describe("when it has Jira-style issue link tokens", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			tokens: {
				issueLinks: {
					prefixes: ["UNICORN-"],
					wildcards: ["[incident]", "*"],
				},
			},
		})
	})

	it("returns the token configuration", async () => {
		const configuration = await getJsonConfiguration()
		expect(configuration).toEqual<DeepPartial<Configuration>>({
			tokens: {
				issueLinks: {
					prefixes: ["UNICORN-"],
					wildcards: ["[incident]", "*"],
				},
			},
			rules: {},
		})
	})
})

describe.each`
	ruleLevel
	${"error"}
	${"off"}
`("when a rule is configured as string '$ruleLevel'", (props: { ruleLevel: "error" | "off" }) => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			rules: {
				noBlankSubjectLines: props.ruleLevel,
				useConciseSubjectLines: props.ruleLevel,
			},
		})
	})

	it("returns the configured rules", async () => {
		const configuration = await getJsonConfiguration()
		expect(configuration).toEqual({
			rules: {
				noBlankSubjectLines: {
					level: props.ruleLevel,
				},
				useConciseSubjectLines: {
					level: props.ruleLevel,
				},
			},
			tokens: {},
		})
	})
})

describe("when a rule without options is configured as an object", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			rules: {
				noBlankSubjectLines: {
					level: "error",
					options: {},
				},
			},
		})
	})

	it("returns the configured rules", async () => {
		const configuration = await getJsonConfiguration()
		expect(configuration).toEqual({
			rules: {
				noBlankSubjectLines: {
					level: "error",
					options: {},
				},
			},
			tokens: {},
		})
	})
})

describe.each`
	ruleKey                          | options
	${"noExcessiveCommitsPerBranch"} | ${{ maxCommits: 8 }}
	${"noRestrictedTrailers"}        | ${{ restrictedKeys: ["Co-authored-by", "Reviewed-by"] }}
	${"useAuthorEmailPatterns"}      | ${{ patterns: [String.raw`.+@example\.com`, String.raw`.+@users\.noreply\.github\.com`] }}
	${"useAuthorNamePatterns"}       | ${{ patterns: ["Ada Lovelace", String.raw`Grace .+`] }}
	${"useCommitterEmailPatterns"}   | ${{ patterns: [String.raw`automation@.+\.dev`] }}
	${"useCommitterNamePatterns"}    | ${{ patterns: ["Release Robot", String.raw`Dependabot .+`] }}
	${"useConciseSubjectLines"}      | ${{ maxLength: 64 }}
	${"useImperativeSubjectLines"}   | ${{ whitelist: ["Revert", "Release"] }}
	${"useIssueLinks"}               | ${{ position: "anywhere" }}
	${"useIssueLinks"}               | ${{ position: "prefix" }}
	${"useIssueLinks"}               | ${{ position: "suffix" }}
	${"useLineWrapping"}             | ${{ maxLength: 80 }}
`(
	"when rule '$ruleKey' is configured with options",
	(props: { ruleKey: RuleKey; options: JsonObject }) => {
		beforeEach(() => {
			mockJsonFile("./comet.json", {
				rules: {
					[props.ruleKey]: {
						level: "error",
						options: props.options,
					},
				},
			})
		})

		it("returns the configured rule and its options", async () => {
			const configuration = await getJsonConfiguration()
			expect(configuration).toEqual({
				rules: {
					[props.ruleKey]: {
						level: "error",
						options: props.options,
					},
				},
				tokens: {},
			})
		})
	},
)

describe("when the JSON configuration file contains a mixed ruleset with both string levels and object configurations", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			rules: {
				noBlankSubjectLines: "off",
				noExcessiveCommitsPerBranch: {
					level: "error",
					options: {
						maxCommits: 5,
					},
				},
				useConciseSubjectLines: "error",
				useImperativeSubjectLines: {
					level: "error",
					options: {
						whitelist: ["Revert"],
					},
				},
			},
		})
	})

	it("returns the configured rules", async () => {
		const configuration = await getJsonConfiguration()
		expect(configuration).toEqual({
			rules: {
				noBlankSubjectLines: {
					level: "off",
				},
				noExcessiveCommitsPerBranch: {
					level: "error",
					options: {
						maxCommits: 5,
					},
				},
				useConciseSubjectLines: {
					level: "error",
				},
				useImperativeSubjectLines: {
					level: "error",
					options: {
						whitelist: ["Revert"],
					},
				},
			},
			tokens: {},
		})
	})
})

describe.each`
	invalidRuleLevel
	${"warn"}
	${"disabled"}
	${"enabled"}
	${123}
	${true}
`(
	"when a rule has an invalid level '$invalidRuleLevel'",
	(props: { invalidRuleLevel: JsonValue }) => {
		beforeEach(() => {
			mockJsonFile("./comet.json", {
				rules: {
					noBlankSubjectLines: props.invalidRuleLevel,
				},
			})
		})

		it("throws an error", async () => {
			await expect(getJsonConfiguration()).rejects.toThrow(
				"Invalid rule configuration in 'comet.json': 'rules.noBlankSubjectLines' must be 'error', 'off', or an object with 'level' and 'options'",
			)
		})
	},
)

describe.each`
	ruleKey                          | options                     | optionName          | expectedValue
	${"noExcessiveCommitsPerBranch"} | ${{ maxCommits: -5 }}       | ${"maxCommits"}     | ${"a positive integer"}
	${"noRestrictedTrailers"}        | ${{ restrictedKeys: true }} | ${"restrictedKeys"} | ${"an array of strings"}
	${"useAuthorEmailPatterns"}      | ${{ patterns: true }}       | ${"patterns"}       | ${"an array of strings"}
	${"useAuthorNamePatterns"}       | ${{ patterns: true }}       | ${"patterns"}       | ${"an array of strings"}
	${"useCommitterEmailPatterns"}   | ${{ patterns: true }}       | ${"patterns"}       | ${"an array of strings"}
	${"useCommitterNamePatterns"}    | ${{ patterns: true }}       | ${"patterns"}       | ${"an array of strings"}
	${"useConciseSubjectLines"}      | ${{ maxLength: -5 }}        | ${"maxLength"}      | ${"a positive integer"}
	${"useConciseSubjectLines"}      | ${{}}                       | ${"maxLength"}      | ${"a positive integer"}
	${"useImperativeSubjectLines"}   | ${{ whitelist: true }}      | ${"whitelist"}      | ${"an array of strings"}
	${"useIssueLinks"}               | ${{ position: "middle" }}   | ${"position"}       | ${"'anywhere', 'prefix', or 'suffix'"}
	${"useLineWrapping"}             | ${{ maxLength: 1.5 }}       | ${"maxLength"}      | ${"a positive integer"}
`(
	"when option '$optionName' of rule '$ruleKey' is invalid",
	(props: { ruleKey: RuleKey; options: JsonObject; optionName: string; expectedValue: string }) => {
		beforeEach(() => {
			mockJsonFile("./comet.json", {
				rules: {
					[props.ruleKey]: {
						level: "error",
						options: props.options,
					},
				},
			})
		})

		it("throws an error describing the required value", async () => {
			await expect(getJsonConfiguration()).rejects.toThrow(
				`Invalid rule configuration in 'comet.json': 'rules.${props.ruleKey}.options.${props.optionName}' must be ${props.expectedValue}`,
			)
		})
	},
)

describe("when an item of a rule option array is invalid", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			rules: {
				useAuthorEmailPatterns: {
					level: "error",
					options: {
						patterns: [String.raw`.+@example\.com`, 42],
					},
				},
			},
		})
	})

	it("throws an error identifying the invalid item", async () => {
		await expect(getJsonConfiguration()).rejects.toThrow(
			"Invalid rule configuration in 'comet.json': 'rules.useAuthorEmailPatterns.options.patterns[1]' must be a string",
		)
	})
})

describe.each`
	description               | ruleConfiguration                 | propertyName | expectedValue
	${"has an invalid level"} | ${{ level: "warn", options: {} }} | ${"level"}   | ${"'error' or 'off'"}
	${"has no level"}         | ${{ options: {} }}                | ${"level"}   | ${"'error' or 'off'"}
	${"has no options"}       | ${{ level: "error" }}             | ${"options"} | ${"an object"}
`(
	"when a rule object $description",
	(props: { ruleConfiguration: JsonObject; propertyName: string; expectedValue: string }) => {
		beforeEach(() => {
			mockJsonFile("./comet.json", {
				rules: {
					noBlankSubjectLines: props.ruleConfiguration,
				},
			})
		})

		it("throws an error describing the malformed property", async () => {
			await expect(getJsonConfiguration()).rejects.toThrow(
				`Invalid rule configuration in 'comet.json': 'rules.noBlankSubjectLines.${props.propertyName}' must be ${props.expectedValue}`,
			)
		})
	},
)

describe("when a rule object has unknown options", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			rules: {
				noBlankSubjectLines: {
					level: "error",
					options: {
						unknownOption: true,
					},
				},
			},
		})
	})

	it("throws an error", async () => {
		await expect(getJsonConfiguration()).rejects.toThrow(
			"Unknown rule option in 'comet.json': 'rules.noBlankSubjectLines.options.unknownOption'",
		)
	})
})

describe("when an unrecognised rule is provided", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			rules: {
				unrecognisedRuleName: "error",
			},
		})
	})

	it("throws an error", async () => {
		await expect(getJsonConfiguration()).rejects.toThrow(
			"Unknown rule in 'comet.json': 'rules.unrecognisedRuleName'",
		)
	})
})

describe("when the JSON configuration root is not an object", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", "Release the robot butler")
	})

	it("throws an error", async () => {
		await expect(getJsonConfiguration()).rejects.toThrow(
			"Invalid configuration in 'comet.json': the root value must be an object",
		)
	})
})

describe.each`
	settingName | invalidValue | configurationType
	${"rules"}  | ${true}      | ${"rule configuration"}
	${"tokens"} | ${42}        | ${"token configuration"}
`(
	"when setting '$settingName' is not an object",
	(props: {
		settingName: "rules" | "tokens"
		invalidValue: JsonValue
		configurationType: string
	}) => {
		beforeEach(() => {
			mockJsonFile("./comet.json", {
				[props.settingName]: props.invalidValue,
			})
		})

		it("throws an error", async () => {
			await expect(getJsonConfiguration()).rejects.toThrow(
				`Invalid ${props.configurationType} in 'comet.json': '${props.settingName}' must be an object`,
			)
		})
	},
)

describe("when the issue link token configuration is not an object", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			tokens: {
				issueLinks: true,
			},
		})
	})

	it("throws an error", async () => {
		await expect(getJsonConfiguration()).rejects.toThrow(
			"Invalid token configuration in 'comet.json': 'tokens.issueLinks' must be an object",
		)
	})
})

describe("when there is an unrecognised top-level property", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			whatIsThis: true,
		})
	})

	it("throws an error", async () => {
		await expect(getJsonConfiguration()).rejects.toThrow(
			"Unknown setting in 'comet.json': 'whatIsThis'",
		)
	})
})

describe.each`
	settingName  | invalidValue
	${"$schema"} | ${42}
	${"extends"} | ${true}
`(
	"when setting '$settingName' has an invalid value",
	(props: { settingName: "$schema" | "extends"; invalidValue: JsonValue }) => {
		beforeEach(() => {
			mockJsonFile("./comet.json", {
				[props.settingName]: props.invalidValue,
			})
		})

		it("throws an error describing the required value", async () => {
			await expect(getJsonConfiguration()).rejects.toThrow(
				`Invalid setting in 'comet.json': '${props.settingName}' must be a string`,
			)
		})
	},
)

describe.each`
	optionName     | invalidValue
	${"prefixes"}  | ${true}
	${"wildcards"} | ${42}
`(
	"when issue link token option '$optionName' has an invalid value",
	(props: { optionName: "prefixes" | "wildcards"; invalidValue: JsonValue }) => {
		beforeEach(() => {
			mockJsonFile("./comet.json", {
				tokens: {
					issueLinks: {
						[props.optionName]: props.invalidValue,
					},
				},
			})
		})

		it("throws an error describing the required value", async () => {
			await expect(getJsonConfiguration()).rejects.toThrow(
				`Invalid token configuration in 'comet.json': 'tokens.issueLinks.${props.optionName}' must be an array of strings`,
			)
		})
	},
)

describe("when an item of an issue link token option is invalid", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			tokens: {
				issueLinks: {
					prefixes: ["#", 42],
				},
			},
		})
	})

	it("throws an error identifying the invalid item", async () => {
		await expect(getJsonConfiguration()).rejects.toThrow(
			"Invalid token configuration in 'comet.json': 'tokens.issueLinks.prefixes[1]' must be a string",
		)
	})
})

describe("when an unrecognised issue link token option is provided", () => {
	beforeEach(() => {
		mockJsonFile("./comet.json", {
			tokens: {
				issueLinks: {
					unrecognisedOption: true,
				},
			},
		})
	})

	it("throws an error", async () => {
		await expect(getJsonConfiguration()).rejects.toThrow(
			"Unknown token option in 'comet.json': 'tokens.issueLinks.unrecognisedOption'",
		)
	})
})
