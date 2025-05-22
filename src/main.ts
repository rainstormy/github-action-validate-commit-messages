import process from "node:process"
import { getGithubActionsConfiguration } from "+adapters/gha/GithubActionsConfiguration"
import { printGithubActionsError } from "+adapters/gha/GithubActionsLogger"
import { getGithubActionsRawCommits } from "+adapters/gha/GithubActionsRawCommits"
import { instructiveReporter } from "+validator/Reporter"
import { validatorFrom } from "+validator/Validator"

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
