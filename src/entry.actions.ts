import { commitRefinerFrom, parseCommit, parseConfiguration } from "+core"
import type { ActionResult } from "+github"
import {
	actionConfigurationMustBeValid,
	allCommitsAreValid,
	pullRequestFromApi,
	reportOf,
	someCommitsAreInvalid,
} from "+github"
import { rulesetParserFrom } from "+validation"
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

	const configuration = parseConfiguration({
		"no-trailing-punctuation-in-subject-lines": {
			whitelist: core.getInput(
				"no-trailing-punctuation-in-subject-lines--whitelist",
				{ required: false },
			),
		},
	})

	const rulesetParser = rulesetParserFrom(configuration)
	const rulesetParseResult = rulesetParser.parse({
		rules: core.getInput("rules", { required: false }),
	})

	if (rulesetParseResult.status === "invalid") {
		return actionConfigurationMustBeValid(rulesetParseResult.errorMessage)
	}

	const pullRequest = await pullRequestFromApi({
		githubToken: core.getInput("github-token", { required: true }),
		pullRequestNumber,
	})

	const commitRefiner = commitRefinerFrom()
	const commits = pullRequest.rawCommits.map((rawCommit) =>
		parseCommit(rawCommit, commitRefiner),
	)

	const report = reportOf({
		ruleset: rulesetParseResult.ruleset,
		commitsToValidate: commits,
	})

	return report === null ? allCommitsAreValid() : someCommitsAreInvalid(report)
}
