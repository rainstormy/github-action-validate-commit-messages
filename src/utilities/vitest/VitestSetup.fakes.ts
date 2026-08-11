/**
 * CAUTION: `vitest.config.ts` references this file by its exact pathname `src/utilities/vitest/VitestSetup.fakes.ts`.
 */

import { expect } from "vitest"
import { mockGitBranchCrudeCommits } from "#commits/git/GetGitBranchCrudeCommits.fakes.ts"
import { mockGithubPullRequestCrudeCommits } from "#commits/github/GetGithubPullRequestCrudeCommits.fakes.ts"
import { mockFiles } from "#utilities/files/Files.fakes.ts"
import { mockGitCli } from "#utilities/git/cli/RunGitCommand.fakes.ts"
import { mockFetch } from "#utilities/http/Fetch.fakes.ts"
import { mockLogger } from "#utilities/logging/Logger.fakes.ts"
import { toContainToken } from "#utilities/vitest/VitestCustomMatchers.fakes.ts"

mockFetch()
mockFiles()
mockGitBranchCrudeCommits()
mockGitCli()
mockGithubPullRequestCrudeCommits()
mockLogger()

expect.extend({ toContainToken })
