import * as v from "valibot"
import {
	JSON_CONFIGURATION_DTO,
	type JsonConfigurationDto,
} from "#configurations/json/dtos/JsonConfigurationDto.ts"
import { readJsonFile } from "#utilities/files/Files.ts"

type ValidationIssue = {
	issue: v.BaseIssue<unknown>
	path: Array<string>
}

type ValidationIssues = readonly [v.BaseIssue<unknown>, ...Array<v.BaseIssue<unknown>>]

const EXPECTED_VALUE_BY_PROPERTY_NAME: Partial<Record<string, string>> = {
	level: "'error' or 'off'",
	maxCommits: "a positive integer",
	maxLength: "a positive integer",
	options: "an object",
	patterns: "an array of strings",
	position: "'anywhere', 'prefix', or 'suffix'",
	prefixes: "an array of strings",
	restrictedKeys: "an array of strings",
	whitelist: "an array of strings",
	wildcards: "an array of strings",
}

export async function fetchJsonConfigurationDto(path: string): Promise<JsonConfigurationDto> {
	const json = await readJsonFile(path)

	try {
		return v.parse(JSON_CONFIGURATION_DTO, json)
	} catch (error) {
		if (error instanceof v.ValiError) {
			throw new TypeError(formatValidationError(error.issues, path), { cause: error })
		}

		throw error
	}
}

function formatValidationError(issues: ValidationIssues, configurationPath: string): string {
	const validationIssue = getMostSpecificValidationIssue(issues)
	const configurationName = configurationPath.replace(/^\.\//u, "")

	if (
		validationIssue.issue.type === "strict_object" &&
		validationIssue.issue.expected === "never"
	) {
		return formatUnknownPropertyError(validationIssue.path, configurationName)
	}

	return formatInvalidValueError(validationIssue, configurationName)
}

function getMostSpecificValidationIssue(
	issues: ValidationIssues,
	parentPath: ReadonlyArray<string> = [],
): ValidationIssue {
	const firstIssue = issues[0]
	let mostSpecificIssue: ValidationIssue = {
		issue: firstIssue,
		path: [...parentPath, ...(firstIssue.path?.map((pathItem) => String(pathItem.key)) ?? [])],
	}

	for (const issue of issues) {
		const path = [...parentPath, ...(issue.path?.map((pathItem) => String(pathItem.key)) ?? [])]
		const candidateIssue =
			issue.issues === undefined
				? { issue, path }
				: getMostSpecificValidationIssue(issue.issues, path)

		if (candidateIssue.path.length > mostSpecificIssue.path.length) {
			mostSpecificIssue = candidateIssue
		}
	}

	return mostSpecificIssue
}
function formatUnknownPropertyError(
	path: ReadonlyArray<string>,
	configurationName: string,
): string {
	const propertyType =
		path[0] === "rules"
			? path.length === 2
				? "rule"
				: "rule option"
			: path[0] === "tokens"
				? "token option"
				: "setting"

	return `Unknown ${propertyType} in '${configurationName}': '${formatConfigurationPropertyPath(path)}'`
}

function formatInvalidValueError(
	validationIssue: ValidationIssue,
	configurationName: string,
): string {
	const propertyPath = formatConfigurationPropertyPath(validationIssue.path)
	const expectedValue = getExpectedValueDescription(validationIssue)

	if (validationIssue.path.length === 0) {
		return `Invalid configuration in '${configurationName}': the root value must be ${expectedValue}`
	}

	const configurationType =
		validationIssue.path[0] === "rules"
			? "rule configuration"
			: validationIssue.path[0] === "tokens"
				? "token configuration"
				: "setting"

	return `Invalid ${configurationType} in '${configurationName}': '${propertyPath}' must be ${expectedValue}`
}

function getExpectedValueDescription(validationIssue: ValidationIssue): string {
	const propertyName = validationIssue.path.at(-1)
	const parentPropertyName = validationIssue.path.at(-2)

	if (validationIssue.path[0] === "rules" && validationIssue.path.length === 2) {
		return "'error', 'off', or an object with 'level' and 'options'"
	}

	const expectedValue =
		propertyName === undefined ? undefined : EXPECTED_VALUE_BY_PROPERTY_NAME[propertyName]
	if (expectedValue !== undefined) {
		return expectedValue
	}

	if (
		isArrayIndex(propertyName) &&
		parentPropertyName !== undefined &&
		EXPECTED_VALUE_BY_PROPERTY_NAME[parentPropertyName] === "an array of strings"
	) {
		return "a string"
	}

	if (validationIssue.issue.type === "string") {
		return "a string"
	}

	if (validationIssue.issue.type === "array") {
		return "an array"
	}

	if (validationIssue.issue.type === "object" || validationIssue.issue.type === "strict_object") {
		return "an object"
	}

	return "a valid value"
}
function isArrayIndex(propertyName: string | undefined): boolean {
	return propertyName !== undefined && /^\d+$/u.test(propertyName)
}

function formatConfigurationPropertyPath(path: ReadonlyArray<string>): string {
	let formattedPath = ""
	for (const propertyName of path) {
		if (isArrayIndex(propertyName)) {
			formattedPath += `[${propertyName}]`
		} else {
			formattedPath += formattedPath.length === 0 ? propertyName : `.${propertyName}`
		}
	}

	return formattedPath
}
