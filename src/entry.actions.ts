import type { ActionResult } from "+github"
import {
	actionConfigurationMustBeValid,
	allCommitsAreValid,
	pullRequestFromApi,
	reportOf,
	someCommitsAreInvalid,
} from "+github"
import { defaultConfiguration, rulesetParserFrom } from "+validation"
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

	const githubToken = core.getInput("github-token", { required: true })
	const commaSeparatedKeys = core.getInput("rules", { required: false })

	const parser = rulesetParserFrom(defaultConfiguration)
	const result = parser.parseCommaSeparatedString(commaSeparatedKeys)

	if (result.status === "invalid") {
		return actionConfigurationMustBeValid(result.errorMessage)
	}

	const pullRequest = await pullRequestFromApi({
		githubToken,
		pullRequestNumber,
	})

	const report = reportOf({
		ruleset: result.ruleset,
		commitsToValidate: pullRequest.commits,
	})

	return report === null ? allCommitsAreValid() : someCommitsAreInvalid(report)
}
