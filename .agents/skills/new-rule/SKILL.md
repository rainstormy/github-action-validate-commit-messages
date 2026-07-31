---
name: new-rule
description: Add or modify rules in Comet. Use when defining a new rule, implementing or modifying rule validation logic, rule options, concerns, reports, corresponding tests, or reviewing any such changes in this area.
---

# New rule

This document describes how to add a new rule to Comet, which involves declaring configurable rule options, implementing validation logic to raise concerns, and outputting formatted concerns in reports.

It uses `noTypos` as an example of a new rule to implement.

## Step 1: Clarify intent

Define the name and purpose of the new rule. All rule names must start with `no` or `use`.

Read `src/domains/rules/Rule.ts` and decide from the existing rule names if the intended behaviour has already been implemented or if the desired name already exists.
Read any existing rule files that may sound similar to the intended behaviour before making the final call.
Note that every rule is focused to a narrow scope. For example, `useAuthorEmailPatterns`, `useAuthorNamePatterns`, and `useCommitterEmailPatterns` are separate rules.
Let me know if the new rule is too similar to an existing rule and prompt for new instructions to clarify if you should modify an existing rule instead of implementing a new one.

Identify the unit(s) under validation: subject line, body lines, user identity (author or committer), or the commit as a whole.

## Step 2: Scaffold function signature

Create a new file in `src/domains/rules/` named after the new rule, for example `NoTypos.ts` or `UseCapitalisedBodyLines.ts` (recall that filenames must be in PascalCase).
Export a named generator function that yields concerns, for example:

```ts
import type { Commits } from "#commits/Commit.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noTypos" satisfies RuleKey

/**
 * Verifies that the subject line and body lines do not contain typos.
 * 
 * It ignores revert commits.
 * It disregards inline code phrases and fenced code blocks.
 */
export function* noTypos(commits: Commits, options: EmptyObject | null): Generator<Concern> {
  if (options === null) {
    return
  }

  throw new Error("The `noTypos` rule has not been implemented yet")
}
```

The function must always accept exactly two arguments: `commits` and `options`.
If `options` is `null`, the rule is disabled by configuration and the function must return immediately without yielding any concerns.

The `rule` const with the rule key reduces code duplication when yielding concerns.

The JSDoc comment above the function should:

- Always begin with 'Verifies that'.
- Describe the scope (e.g. whether the rule covers subject lines, body lines, authors, etc.) and intent of the rule (as clarified in Step 1).
- Describe under which conditions the rule does not apply or only partially applies.

Insert the rule key or function into the existing alphabetically ordered lists found in:

- `src/domains/rules/Rule.ts`
- `getDefaultCliConfiguration` and `getDefaultGhaConfiguration` in `src/domains/configurations/GetDefaultConfiguration.ts` with a null argument
- `emptyRuleConfiguration` and `fakeConfiguration` in `src/domains/configurations/Configuration.fakes.ts`
- `mapCommitsToConcerns` in `src/domains/rules/concerns/Concern.ts`
- Relevant concerns in `src/domains/rules/concerns/`

## Step 3: Specify rule options

Use `EmptyObject` when the rule does not accept configurable options. This is the most common scenario.
Update `getDefaultCliConfiguration` and `getDefaultGhaConfiguration` in `src/domains/configurations/GetDefaultConfiguration.ts` with the empty object `{}` instead of null unless the rule should be disabled by default.
Then skip the rest of this section and proceed to Step 4.

Declare the set of options in an inline record type in the function signature, for example:

```ts
export function* noTypos(
  commits: Commits,
  options: { whitelist: Array<string> } | null,
): Generator<Concern> {}
```

Use simple, JSON-serialisable types like `number`, `string`, and `Array` in option props, as rule options are user-facing through the `comet.json` configuration file.

Extract the rule options into data structures that are easier to work with and sanitise the input, for example:

```ts
export function* noTypos(
  commits: Commits,
  options: { whitelist: Array<string> } | null,
): Generator<Concern> {
  if (options === null) {
    return
  }

  const whitelist = new Set(
    options.whitelist.map((word) => word.trim().toLowerCase()).filter(notEmptyString),
  )
}
```

Common sanitisation scenarios:

- `number` -> `Math.trunc()` (when it should be an integer) and return early if negative values are not allowed (e.g. `if (options === null || options.numericValue < 0)`)
- `string` -> `.trim().toLowerCase()` (when normalising for comparisons)
- `Array` -> `.filter()`

Update `getDefaultCliConfiguration` and `getDefaultGhaConfiguration` in `src/domains/configurations/GetDefaultConfiguration.ts` with good default options.
Look at the existing default values for inspiration. Usually, array options like `whitelist` should be empty by default.
Leave the options as null if the rule should be disabled by default.
Prompt me if you need my input.

## Step 4: Outline unit tests

Create a new `.tests.ts` file next to the rule file, for example `NoTypos.tests.ts` or `UseCapitalisedBodyLines.tests.ts`.

Start by setting up the rule configuration for the test. For example, for a rule without options:

```ts
const rule = "noTypos" satisfies RuleKey

const disabled = emptyRuleConfiguration()
const enabled = emptyRuleConfiguration({ [rule]: {} })

const fakeCommit = fakeCommitFactory()
```

For a rule with options, it has multiple `enabled` scenarios, for example:

```ts
const rule = "noTypos" satisfies RuleKey

const disabled = emptyRuleConfiguration()
const enabled = emptyRuleConfiguration({ [rule]: {} })
const enabledWhitelist = emptyRuleConfiguration({ [rule]: { whitelist: ["chatify", "rainstormed"] } })

const fakeCommit = fakeCommitFactory()
```

Use `describe.each` in Vitest to cover many test cases easily.
A test suite for a rule has at least 4 top-level `describe.each` blocks to cover these scenarios:

- when the commit violates the rule (e.g. when the subject line contains one or multiple typos)
  - and the rule is enabled -> it raises a concern
  - and the rule is disabled -> it does not raise a concern
- when the commit does not violate the rule
  - and the rule is enabled -> it does not raise a concern
  - and the rule is disabled -> it does not raise a concern
- when verifying a set of multiple commits and some commits violate the rule
  - and the rule is enabled -> it raises a concern for each violating commit
  - and the rule is disabled -> it does not raise any concerns
- when verifying a set of multiple commits and all commits are good
  - and the rule is enabled -> it does not raise any concerns
  - and the rule is disabled -> it does not raise any concerns

Assert that the rule raises concerns at the expected character ranges.

For example, a simple top-level block could look like this for a rule that covers subject lines:

```ts
describe.each`
	subjectLine                | expectedRange
	${"initz"}                 | ${[0, 5]}
	${"I'm flabbbergastered"}  | ${[4, 20]}
	${"Give me eternal welth"} | ${[16, 21]}
	${"#1 repared again"}      | ${[3, 10]}
	${"squash!  my baad"}      | ${[12, 16]}
`(
  "when the subject line of $subjectLine contains a typo",
  (props: { subjectLine: string; expectedRange: CharacterRange }) => {
    const commit = fakeCommit({ message: props.subjectLine })

    describe("and the rule is enabled", () => {
      const actualConcerns = mapCommitsToConcerns([commit], enabled)

      it("raises a concern about the misspelled word", () => {
        expect(actualConcerns).toEqual<Concerns>([
          subjectLineConcern(rule, commit.sha, { range: props.expectedRange }),
        ])
      })
    })

    describe("and the rule is disabled", () => {
      const actualConcerns = mapCommitsToConcerns([commit], disabled)

      it("does not raise any concerns", () => {
        expect(actualConcerns).toEqual<Concerns>([])
      })
    })
  },
)
```

Additional blocks are needed to cover complex rules with options (e.g. `enabled` and `enabledWhitelist`) or multiple locations for concerns (e.g. subject line + body lines).
Be sure to cover many different tokens, for example (but not exhaustive):

- empty or blank subject lines
- single-word subject lines
- leading and trailing whitespace
- capitalised and lowercase leading words
- verbs in imperative mood and in past tense
- mix of letters, numbers, and punctuation
- squash tokens (e.g. `fixup!`) and revert tokens (e.g. `Revert "`)
- semver tokens (e.g. `1.2.0-beta.1`)
- issuelink tokens
- inline code phrases and fenced code blocks
- trailers

Prefer creative, realistic, lowkey funny commit messages and author names over repetitive placeholder data.
They should resemble a large variety of real-world commit messages. For example:

- `Release the robot butler`
- `made the console less dramatic`
- `Revert "fix this confusing plate of spaghetti"`
- `Compare the list of items to the objects downloaded from the server`
- `squash! Paint the eggs with suspicious enthusiasm`
- `#42 Consolidate `BadgeFactory` with `BadgeService` and count to ten`
- `1 2 3 beep! boop!`

Read some existing test files for inspiration.

## Step 5: Implement validation logic

The rule function must validate each commit. Use a for..of loop to iterate over the commits.
For each commit, determine if and where it violates the rule and yield one appropriately located concern per violation. Do not yield a concern for conforming input.
Skip commits that should be ignored by the rule.

For example:

```ts
export function* noTypos(
  commits: Commits,
  options: { whitelist: Array<string> } | null,
): Generator<Concern> {
  if (options === null) {
    return
  }

  const whitelist = new Set(
    options.whitelist.map((word) => word.trim().toLowerCase()).filter(notEmptyString),
  )

  for (const commit of commits) {
    if (commit.subjectLine.some(isToken("revert"))) {
      continue
    }

    const misspelledWords = commit.subjectLine
      .filter(isToken("word"))
      .filter((word) => !whitelist.has(word.value.toLowerCase()))
      .filter(isMisspelledWord)

    for (const word of misspelledWords) {
      yield subjectLineConcern(rule, commit.sha, { range: word.range })
    }
  }
}
```

If the rule concerns the subject line or the body lines, consult `src/domains/commits/Token.ts` for a list of all tokens and associated utility functions.

If you need to add or modify commit message tokens, follow the instructions in `.agents/skills/new-token-type/SKILL.md` and implement those changes in a separate commit.

Iterate over the rule implementation and its unit tests in a TDD-like manner until it satisfies all requirements as clarified in Step 1.
For example:

```shell
vpr test 'src/domains/rules/NoTypos.tests.ts'
```

## Step 6: Implement reports

Add at least 2 test cases to `src/domains/rules/reports/CommitwiseReport.tests.ts` to cover the new rule.
Note that test cases appear in alphabetical order by rule names.

The test cases also serve as visual documentation of how concerns will appear to the end users.
Prompt me if you want feedback on the message that appear when the new rule is violated.

Implement the message in `src/domains/rules/reports/CommitwiseReport.ts`.

Run the mandatory project-wide checks before finishing:

```shell
vpr fmt
vpr check
vpr test
```
