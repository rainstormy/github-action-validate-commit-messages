import type { ActionResult } from "+github"
import {
	actionConfigurationMustBeValid,
	allCommitsAreValid,
	configurationFromInputs,
	formatIssue,
	getPullRequestFromApi,
	someCommitsAreInvalid,
} from "+github"
import { instructiveReporter, validatorFrom } from "+validator"
import core from "@actions/core"
import github from "@actions/github"

run()
	.then((actionResult) => {
		// eslint-disable-next-line functional/no-conditional-statements -- This side effect is required by the GitHub Actions API.
		if (actionResult.exitCode !== 0) {
			core.setFailed(actionResult.errorMessage)
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
		return actionConfigurationMustBeValid(
			"This action must run on a pull request",
		)
	}

	const configuration = configurationFromInputs()

	if (!configuration.success) {
		const formattedErrors = configuration.error.issues
			.map((issue) => formatIssue(issue))
			.join("\n")

		return actionConfigurationMustBeValid(formattedErrors)
	}

	const pullRequest = await getPullRequestFromApi(pullRequestNumber)

	const validate = validatorFrom(configuration.data)
	const report = validate(
		pullRequest.rawCommits,
		instructiveReporter(configuration.data),
	)

	return report === "" ? allCommitsAreValid() : someCommitsAreInvalid(report)
}
