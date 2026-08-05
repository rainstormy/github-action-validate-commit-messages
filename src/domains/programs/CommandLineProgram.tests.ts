import { beforeEach, describe, expect, it } from "vitest"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fakes.ts"
import { mockCrudeCommits } from "#commits/GetCrudeCommits.fakes.ts"
import { commandLineProgram, getHelpText } from "#programs/CommandLineProgram.ts"
import { fakeCommitSha } from "#types/CommitSha.fakes.ts"
import { EXIT_CODE_GENERAL_ERROR, EXIT_CODE_SUCCESS, type ExitCode } from "#types/ExitCode.ts"
import type { SemanticVersionString } from "#types/SemanticVersionString.ts"
import { mockGitCommand } from "#utilities/git/cli/RunGitCommand.fakes.ts"
import { printError, printMessage } from "#utilities/logging/Logger.ts"
import { mockCometPlatform } from "#utilities/platform/CometPlatform.fakes.ts"
import { mockCometVersion } from "#utilities/version/CometVersion.fakes.ts"

beforeEach(() => {
	mockCometPlatform("cli")
})

describe("the help text", () => {
	it("is a list of program arguments and options", () => {
		expect(getHelpText()).toBe("Usage: comet [options]")
	})

	it("fits within a window of 80 characters", () => {
		const lines = getHelpText().split("\n")

		for (const line of lines) {
			expect(line.length).toBeLessThanOrEqual(80)
		}
	})
})

describe.each`
	args
	${["--help"]}
	${["-h"]}
	${["--config", "configs/comet.jsonc", "--help"]}
	${["-h", "-v"]}
`("when the args of $args contain the '--help'/'-h' flag", (props: { args: Array<string> }) => {
	let exitCode: ExitCode

	beforeEach(async () => {
		exitCode = await commandLineProgram(props.args)
	})

	it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
		expect(exitCode).toBe(EXIT_CODE_SUCCESS)
	})

	it("prints a help text with usage instructions", () => {
		expect(printMessage).toHaveBeenCalledExactlyOnceWith(getHelpText())
	})
})

describe.each`
	args                                                | version
	${["--version"]}                                    | ${"1.0.0"}
	${["-v"]}                                           | ${"2.0.8"}
	${["--config", "configs/comet.jsonc", "--version"]} | ${"3.2.0-beta.1"}
`(
	"when the args of $args contain the '--version'/'-v' flag and the tool version in the 'package.json' file is $version",
	(props: { args: Array<string>; version: SemanticVersionString }) => {
		let exitCode: ExitCode

		beforeEach(async () => {
			mockCometVersion(props.version)
			exitCode = await commandLineProgram(props.args)
		})

		it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
			expect(exitCode).toBe(EXIT_CODE_SUCCESS)
		})

		it(`prints the tool version of '${props.version}'`, () => {
			expect(printMessage).toHaveBeenCalledExactlyOnceWith(props.version)
		})
	},
)

describe("when the default Git branch cannot be determined", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGitCommand("remote", { output: "" })
		mockGitCommand("rev-parse --verify --quiet main", { exitCode: 1 })
		mockGitCommand("rev-parse --verify --quiet master", { exitCode: 1 })
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints an error message that describes the unexpected Git state", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"Expected a default remote branch (e.g. 'origin/main') or a local branch named 'main' or 'master'",
		)
	})
})

describe("when the 'git remote' command raises an error", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGitCommand("remote", { exitCode: 1 })
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints the error message raised by the local Git client", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"Command 'git remote' failed with exit code 1",
		)
	})
})

describe("when the 'git rev-parse' command raises an error", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGitCommand("remote", { output: "origin" })
		mockGitCommand("rev-parse --abbrev-ref origin/HEAD", { exitCode: 128 })
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints the error message raised by the local Git client", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"Command 'git rev-parse --abbrev-ref origin/HEAD' failed with exit code 128",
		)
	})
})

describe("when the 'git log' command raises an error", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockGitCommand("remote", { output: "origin" })
		mockGitCommand("rev-parse --abbrev-ref origin/HEAD", { output: "origin/main" })
		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", { exitCode: 31 })
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints the error message raised by the local Git client", () => {
		expect(printError).toHaveBeenCalledExactlyOnceWith(
			"Command 'git --no-pager log --format=raw --no-color origin/main..HEAD' failed with exit code 31",
		)
	})
})

describe("when there are no commits", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
		expect(exitCode).toBe(EXIT_CODE_SUCCESS)
	})

	it("remains silent", () => {
		expect(printMessage).not.toHaveBeenCalled()
		expect(printError).not.toHaveBeenCalled()
	})
})

describe("when there is 1 commit that raises no concerns in the default configuration", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([fakeCrudeCommit({ message: "Release the robot butler" })])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
		expect(exitCode).toBe(EXIT_CODE_SUCCESS)
	})

	it("remains silent", () => {
		expect(printMessage).not.toHaveBeenCalled()
		expect(printError).not.toHaveBeenCalled()
	})
})

describe("when there are 4 commits that raise no concerns in the default configuration", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([
			fakeCrudeCommit({ message: "Establish the repository" }),
			fakeCrudeCommit({ message: "Enable the coffee machine integration tests" }),
			fakeCrudeCommit({ message: "Drop the legacy spaghetti tower module" }),
			fakeCrudeCommit({ message: "Help fix the annoying bug" }),
		])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_SUCCESS}`, () => {
		expect(exitCode).toBe(EXIT_CODE_SUCCESS)
	})

	it("remains silent", () => {
		expect(printMessage).not.toHaveBeenCalled()
		expect(printError).not.toHaveBeenCalled()
	})
})

describe("when there is 1 commit that raises concerns in the default configuration", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([
			fakeCrudeCommit({
				sha: "98634c15dcab46ae1f23ca87a8d66467093415b3",
				message: "fix!",
			}),
		])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("reports all concerns", () => {
		expect(printMessage).toHaveBeenCalledExactlyOnceWith(
			`
98634c1 fix!
        ┬
        ╰─ The first letter in subject lines must be in uppercase.
           (useCapitalisedSubjectLines)

98634c1 fix!
        ─┬─
         ╰─ Subject lines must contain at least two words.
            (noSingleWordSubjectLines)

98634c1 fix!
           ┬
           ╰─ Subject lines must not end with punctuation.
              (noUnexpectedPunctuation)
`.trim(),
		)
	})
})

describe("when there are 2 commits that raise concerns in the default configuration", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([
			fakeCrudeCommit({
				sha: "61a95da418709622ebb04c6bc08977c96ea915b5",
				message: "Document the tea set\n\nA  small note",
			}),
			fakeCrudeCommit({
				sha: "d677c3124551246b6e8b65c7708538e93d3f2a19",
				message:
					"Review the tea set\n\nThis body line is intentionally longer than the default seventy-two character wrapping limit",
			}),
		])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints a sorted commitwise report of all concerns", () => {
		expect(printMessage).toHaveBeenCalledExactlyOnceWith(
			`
61a95da Document the tea set
    ╭──
  1 │ 
∙ 2 │ A  small note
    ·  ┬─
    ·  ╰─ Message bodies must not contain excessive whitespace.
    ·     (noExcessiveWhitespace)
    ╰──

d677c31 Review the tea set
    ╭──
  1 │ 
∙ 2 │ This body line is intentionally longer than the default seventy-two character wrapping limit
    ·                                                                         ──────────┬─────────
    ·                                Message body lines must not exceed 72 characters. ─╯
    ·                                (useLineWrapping)
    ╰──
`.trim(),
		)
	})
})

describe("when there are 3 commits that raise concerns in the default configuration", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([
			fakeCrudeCommit({
				sha: "335aee65f7a82c2f85771f45d9cfec47efab1547",
				message: "polish the tea set",
			}),
			fakeCrudeCommit({
				sha: "6f8dafa2608a817129c2ff899c5122eb69ba45cb",
				message: "Document the tea set\n\nA  small note",
			}),
			fakeCrudeCommit({
				sha: "b58de17b4d44256ffaa44a1068d743288fc6beda",
				message: "Sign the pantry inventory",
				signature: "",
			}),
		])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints a sorted commitwise report of all concerns", () => {
		expect(printMessage).toHaveBeenCalledExactlyOnceWith(
			`
335aee6 polish the tea set
        ┬
        ╰─ The first letter in subject lines must be in uppercase.
           (useCapitalisedSubjectLines)

6f8dafa Document the tea set
    ╭──
  1 │ 
∙ 2 │ A  small note
    ·  ┬─
    ·  ╰─ Message bodies must not contain excessive whitespace.
    ·     (noExcessiveWhitespace)
    ╰──

b58de17 Sign the pantry inventory
      ╭──────────────────────────
      ╰─ Commits must be signed cryptographically with a signing key.
         (useSignedCommits)
`.trim(),
		)
	})
})

describe("when there are 6 commits where 4 of them raise concerns in the default configuration", () => {
	let exitCode: ExitCode

	beforeEach(async () => {
		mockCrudeCommits([
			fakeCrudeCommit({
				sha: "7e63a377f295406fea7cfd5ea4dbe9aecc88e142",
				message: "polish the tea set!",
			}),
			fakeCrudeCommit({ message: "Refactor the teapot module" }),
			fakeCrudeCommit({
				sha: "3cfe8b3d1909b1ce937fbf9dc7fc443f675c7ee2",
				message: "Document the tea set\n\nA  small note",
			}),
			fakeCrudeCommit({
				sha: "41a0e1d9c151ac41962836e4f02b2b47d39ffd61",
				message:
					"Review the tea set\nWell well well would you look at this.\n\nThis body line is _also_ a bit longer than the default seventy-two character wrapping limit\nWe'll have to fix that, don't we?",
				signature: "",
			}),
			fakeCrudeCommit({
				sha: "7f811b212b8e79d85a3cab7acb276942c565fb4a",
				message: "Merge the old tea ledger",
				parents: [fakeCommitSha(), fakeCommitSha()],
			}),
			fakeCrudeCommit({ message: "Sign the pantry inventory" }),
		])
		exitCode = await commandLineProgram([])
	})

	it(`exits with ${EXIT_CODE_GENERAL_ERROR}`, () => {
		expect(exitCode).toBe(EXIT_CODE_GENERAL_ERROR)
	})

	it("prints a sorted commitwise report of all concerns", () => {
		expect(printMessage).toHaveBeenCalledExactlyOnceWith(
			`
7e63a37 polish the tea set!
        ┬
        ╰─ The first letter in subject lines must be in uppercase.
           (useCapitalisedSubjectLines)

7e63a37 polish the tea set!
                          ┬
                          ╰─ Subject lines must not end with punctuation.
                             (noUnexpectedPunctuation)

3cfe8b3 Document the tea set
    ╭──
  1 │ 
∙ 2 │ A  small note
    ·  ┬─
    ·  ╰─ Message bodies must not contain excessive whitespace.
    ·     (noExcessiveWhitespace)
    ╰──

41a0e1d Review the tea set
      ╭───────────────────
      ╰─ Commits must be signed cryptographically with a signing key.
         (useSignedCommits)

41a0e1d Review the tea set
    ╭──
∙ 1 │ Well well well would you look at this.
    · ┬
    · ╰─ Subject lines and message bodies must be separated by exactly one empty line.
    ·    (useEmptyLineBeforeBodyLines)
  2 │ 
    ╰──

41a0e1d Review the tea set
    ╭──
  2 │ 
∙ 3 │ This body line is _also_ a bit longer than the default seventy-two character wrapping limit
    ·                                                                         ─────────┬─────────
    ·                               Message body lines must not exceed 72 characters. ─╯
    ·                               (useLineWrapping)
  4 │ We'll have to fix that, don't we?
    ╰──

7f811b2 Merge the old tea ledger
      ╭─────────────────────────
      ╰─ Merge commits are not allowed.
         (noMergeCommits)
`.trim(),
		)
	})
})
