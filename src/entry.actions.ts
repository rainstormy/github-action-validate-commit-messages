import {
	actionFailed,
	actionSucceeded,
	type ActionResult,
} from "+github/ActionResult"
import { configurationFromInputs, formatIssue } from "+github/InputParameters"
import { getPullRequestFromApi } from "+github/PullRequest"
import { instructiveReporter } from "+validator/Reporter"
import { validatorFrom } from "+validator/Validator"
import core from "@actions/core"
import github from "@actions/github"

run()
	.then((actionResult) => {
		if (actionResult.exitCode === 1) {
			for (const errorMessage of actionResult.errors) {
				core.error(`${errorMessage}\n`)
			}
			core.setFailed("")
		}
	})
	.catch((error) => {
		const errorMessage =
			error instanceof Error ? error.message : "An unspecified error occurred"
		core.setFailed(errorMessage)
	})

async function run(): Promise<ActionResult> {
	const pullRequestNumber = github.context.payload.pull_request?.number

	if (pullRequestNumber === undefined) {
		return actionFailed(["This action must run on a pull request"])
	}

	const configuration = configurationFromInputs()

	if (!configuration.success) {
		const formattedErrors = configuration.error.issues.map((issue) =>
			formatIssue(issue),
		)

		return actionFailed(formattedErrors)
	}

	const pullRequest = await getPullRequestFromApi(pullRequestNumber)

	const reporter = instructiveReporter(configuration.data)
	const validate = validatorFrom(configuration.data)
	const reportedErrors = validate(pullRequest.rawCommits, reporter)

	return reportedErrors.length === 0
		? actionSucceeded()
		: actionFailed(reportedErrors)
}
