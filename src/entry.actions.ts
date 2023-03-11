import { commitRefinerFrom, parseCommit } from "+commits"
import type { ActionResult } from "+github"
import {
	actionConfigurationMustBeValid,
	allCommitsAreValid,
	configurationFromInputs,
	getPullRequestFromApi,
	someCommitsAreInvalid,
} from "+github"
import { reportFrom } from "+rules"
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
		return actionConfigurationMustBeValid(
			configuration.error.flatten().formErrors.join("\n\n"),
		)
	}

	const pullRequest = await getPullRequestFromApi(pullRequestNumber)

	const commitRefiner = commitRefinerFrom()
	const commits = pullRequest.rawCommits.map((rawCommit) =>
		parseCommit(rawCommit, commitRefiner),
	)

	const report = reportFrom({
		configuration: configuration.data,
		commitsToValidate: commits,
	})

	return report === "" ? allCommitsAreValid() : someCommitsAreInvalid(report)
}
