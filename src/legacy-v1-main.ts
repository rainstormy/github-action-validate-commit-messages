import process from "node:process"
import { getGithubActionsConfiguration } from "#legacy-v1/adapters/gha/GithubActionsConfiguration"
import { printGithubActionsError } from "#legacy-v1/adapters/gha/GithubActionsLogger"
import { getGithubActionsRawCommits } from "#legacy-v1/adapters/gha/GithubActionsRawCommits"
import { instructiveReporter } from "#legacy-v1/validator/Reporter"
import { validatorFrom } from "#legacy-v1/validator/Validator"

try {
	const configuration = getGithubActionsConfiguration()
	const reporter = instructiveReporter(configuration)
	const validate = validatorFrom(configuration)

	const rawCommits = await getGithubActionsRawCommits()
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
