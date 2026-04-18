# Agent Contribution Guidelines

'Comet' is a linter to ensure that Git commit messages conform to certain standards and conventions as declared by a customisable set of rules.
Its intended use is in local Git hooks and as part of the CI pipeline in GitHub pull requests.

## Key technologies
- **Language:** TypeScript
- **Runtime:** Node.js 24
- **Package managers:** mise-en-place and pnpm
- **Bundler:** Vite
- **Testing framework:** Vitest
- **CI/CD pipeline:** GitHub Actions

## Project structure
- `src/main-cli.ts`: Comet CLI entrypoint
- `src/main-gha.ts`: Comet GitHub Actions entrypoint
- `src/legacy-v1-main.ts`: Legacy entrypoint, no longer maintained
- `src/domains/commits/`: Commits and tokenised commit messages
- `src/domains/configurations/`: Configurations to customise Comet's behaviour
- `src/domains/programs/`: Program flows invoked by entrypoints
- `src/domains/rules/`: Rule validation logic and reporters to output concerns
- `src/types/`: Self-contained TypeScript types and related utilities
- `src/utilities/`: General-purpose utilities and adapters to externals (local Git client, GitHub REST API, local file system, console output, etc.)
- `src/legacy-v1/`: Legacy code, no longer maintained, to be migrated to v2
- `docs/`: Markdown documentation for contributors and for end users
- `README.md`: Usage instructions for end users of Comet

## Common development tasks
- `mise install`: Installs all required tools and dependencies
- `mise run check`: Verifies that the source code is clean, type-safe, and well-formatted
- `mise run format`: Applies linting suggestions and reformats the source code
- `mise run test`: Runs the entire unit test suite once (equivalent to `vitest run`, accepts same arguments)

Always use mise to install dependencies and run tasks. Never use pnpm, npm, npx, nvm, or yarn for this.

## Principles
- Prefer functional and immutable solutions unless an imperative and mutable solution is clearly superior, e.g. in terms of performance or readability
- Prefer creative, realistic, and lowkey funny data over boring, repetitive data in unit tests, e.g. for commit messages and author names under test
- Prefer simple and consistent solutions over clever ones
- Follow patterns of existing code

## Code style
- Use PascalCase in filenames with extensions of `.ts` for source files and `.tests.ts` for test files
- Use tab indents
- Use double quotes for strings unless escaping is required
- Omit trailing semicolons
- Omit `readonly` modifiers unless absolutely necessary
- Use predictable top-down declaration order of functions and types like Uncle Bob's stepdown rule
- Always prefer path aliases prefixed by `#` over relative paths in imports (consult `tsconfig.json` for valid aliases)
- Include file extensions (`.ts`) in imports
- Always prefer `type` over `interface` (except in `d.ts` files)
- Always prefer named `function` declarations over `const` arrow functions
- Always prefer generic `Array<Item>` over shorthand `Item[]` syntax
- Always specify types on top-level consts and all function parameters and return values,
- Never use `any` and avoid type casts with `as`

## Git workflow
- Each commit should be atomic, self-contained, and easily revertible
- Keep changes and diffs small and focused
- Follow the same general commit message standards as the existing commits, write concise subject lines in commit messages, and add additional context in the commit message body
- Rebase your branch onto `main` instead of merging `main` into your branch

## Common scenarios
### Add a new rule
- Implement the rule logic in the appropriate file in `src/domains/rules/`
- For each commit to verify, return the appropriate concern when the rule is violated and return null when all is good
- Write unit tests for the rule in isolation, including multiple positive and negative cases, covering edge cases and different configurations if applicable
- Support the new rule in reports in `src/domains/rules/reports/`
- Write unit tests for the reports

### Tokenise parts of a commit message
- Define the token type in `src/domains/commits/tokens/`
- Implement the tokeniser function
- Write unit tests for the tokeniser in isolation, including multiple positive and negative cases, covering edge cases and different configurations if applicable
- Add some test cases where the new token is mixed with other tokens
