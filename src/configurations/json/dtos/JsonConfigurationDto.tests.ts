import * as v from "valibot"
import { expect, it } from "vitest"
import { JSON_CONFIGURATION_DTO } from "#configurations/json/dtos/JsonConfigurationDto.ts"

it("parses an empty configuration", () => {
	const json = {}

	expect(v.parse(JSON_CONFIGURATION_DTO, json)).toEqual({})
})

it("parses metadata properties", () => {
	const json = {
		$schema: "https://example.com/schema.json",
		extends: "@rainstormy/comet-config",
	}

	expect(v.parse(JSON_CONFIGURATION_DTO, json)).toEqual({
		$schema: "https://example.com/schema.json",
		extends: "@rainstormy/comet-config",
	})
})

it("parses tokens configuration", () => {
	const json = {
		tokens: {
			issueLinks: {
				prefixes: ["#", "GH-"],
				wildcards: ["*"],
			},
		},
	}

	expect(v.parse(JSON_CONFIGURATION_DTO, json)).toEqual({
		tokens: {
			issueLinks: {
				prefixes: ["#", "GH-"],
				wildcards: ["*"],
			},
		},
	})
})

it.each`
	ruleLevel
	${"error"}
	${"off"}
`(
	"parses a rule configured as string '$ruleLevel'",
	({ ruleLevel }: { ruleLevel: "error" | "off" }) => {
		const json = {
			rules: {
				noBlankSubjectLines: ruleLevel,
				useConciseSubjectLines: ruleLevel,
			},
		}

		expect(v.parse(JSON_CONFIGURATION_DTO, json)).toEqual({
			rules: {
				noBlankSubjectLines: ruleLevel,
				useConciseSubjectLines: ruleLevel,
			},
		})
	},
)

it("parses a rule configured as an object with level and options", () => {
	const json = {
		rules: {
			noBlankSubjectLines: {
				level: "error",
				options: {},
			},
			useConciseSubjectLines: {
				level: "error",
				options: {
					maxLength: 50,
				},
			},
		},
	}

	expect(v.parse(JSON_CONFIGURATION_DTO, json)).toEqual({
		rules: {
			noBlankSubjectLines: {
				level: "error",
				options: {},
			},
			useConciseSubjectLines: {
				level: "error",
				options: {
					maxLength: 50,
				},
			},
		},
	})
})

it("parses a mixed ruleset with both string levels and object configurations", () => {
	const json = {
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
	}

	expect(v.parse(JSON_CONFIGURATION_DTO, json)).toEqual({
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

it.each`
	invalidRuleLevel
	${"warn"}
	${"disabled"}
	${"enabled"}
	${123}
	${true}
`(
	"fails when a rule has an invalid level '$invalidRuleLevel'",
	({ invalidRuleLevel }: { invalidRuleLevel: unknown }) => {
		const json = {
			rules: {
				noBlankSubjectLines: invalidRuleLevel,
			},
		}

		expect(() => v.parse(JSON_CONFIGURATION_DTO, json)).toThrow(v.ValiError)
	},
)

it("fails when a rule object has an invalid option type", () => {
	const json = {
		rules: {
			useConciseSubjectLines: {
				level: "error",
				options: {
					maxLength: -5,
				},
			},
		},
	}

	expect(() => v.parse(JSON_CONFIGURATION_DTO, json)).toThrow(v.ValiError)
})

it("fails when a rule object has unknown options", () => {
	const json = {
		rules: {
			noBlankSubjectLines: {
				level: "error",
				options: {
					unknownOption: true,
				},
			},
		},
	}

	expect(() => v.parse(JSON_CONFIGURATION_DTO, json)).toThrow(v.ValiError)
})

it("fails when an unrecognised rule is provided", () => {
	const json = {
		rules: {
			unrecognisedRuleName: "error",
		},
	}

	expect(() => v.parse(JSON_CONFIGURATION_DTO, json)).toThrow(v.ValiError)
})

it("fails when an unrecognised top-level property is provided", () => {
	const json = {
		unrecognisedProperty: true,
	}

	expect(() => v.parse(JSON_CONFIGURATION_DTO, json)).toThrow(v.ValiError)
})
