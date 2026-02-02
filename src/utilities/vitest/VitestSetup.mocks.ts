/**
 * CAUTION: `vitest.config.ts` references this file by its exact pathname `src/utilities/vitest/VitestSetup.mocks.ts`.
 */

import { mockFiles } from "#utilities/files/Files.mocks.ts"
import { mockGitCli } from "#utilities/git/cli/RunGitCommand.mocks.ts"
import { mockFetch } from "#utilities/http/Fetch.mocks.ts"
import { mockLogger } from "#utilities/logging/Logger.mocks.ts"

mockFetch()
mockFiles()
mockGitCli()
mockLogger()
