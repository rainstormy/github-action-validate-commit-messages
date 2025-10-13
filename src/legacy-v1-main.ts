import process from "node:process"
import { printGithubActionsError } from "#legacy-v1/adapters/gha/GithubActionsLogger.ts"
import { legacyV1GetGithubActionsConfiguration } from "#legacy-v1/adapters/gha/LegacyV1GithubActionsConfiguration.ts"
import { legacyV1GetGithubActionsRawCommits } from "#legacy-v1/adapters/gha/LegacyV1GithubActionsRawCommits.ts"
import { legacyV1InstructiveReporter } from "#legacy-v1/validator/LegacyV1Reporter.ts"
import { legacyV1ValidatorFrom } from "#legacy-v1/validator/LegacyV1Validator.ts"

try {
	const configuration = legacyV1GetGithubActionsConfiguration()
	const reporter = legacyV1InstructiveReporter(configuration)
	const validate = legacyV1ValidatorFrom(configuration)

	const rawCommits = await legacyV1GetGithubActionsRawCommits()
	const reportedErrors = validate(rawCommits, reporter)

	if (reportedErrors.length > 0) {
		for (const errorMessage of reportedErrors) {
			printGithubActionsError(errorMessage)
		}
		process.exit(1)
	}
} catch (error) {
	printGithubActionsError(
		error instanceof Error ? error.message : "An unspecified error occurred",
	)
	process.exit(1)
}
