# Contribution Guidelines

## Quick Start
- [Get started on 🍏 macOS](docs/quick-start/get-started-on-macos.md)
- [Get started on 🐧 Ubuntu](docs/quick-start/get-started-on-ubuntu.md)
- [Get started on 🟦 Windows](docs/quick-start/get-started-on-windows.md)

## Tasks
```shell
mise run name_of_task
```

| Task name         | Alias | Description                                                                                                                                                                                      |
|-------------------|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `build`           | `b`   | Runs `build-cli`, `build-gha`, and `build-legacy-v1`.                                                                                                                                            |
| `build-cli`       | `bc`  | Generates production-grade build artefacts of the v2 command-line entrypoint with [Vite](https://vite.dev).                                                                                      |
| `build-gha`       | `bg`  | Generates production-grade build artefacts of the v2 GitHub Actions entrypoint with [Vite](https://vite.dev).                                                                                    |
| `build-legacy-v1` |       | Generates production-grade build artefacts of the legacy v1 GitHub Actions entrypoint with [Vite](https://vite.dev).                                                                             |
| `check`           | `c`   | Runs `check-actions`, `check-format`, and `check-types`.                                                                                                                                         |
| `check-actions`   | `ca`  | Verifies that the GitHub Actions workflows are valid with [actionlint](https://github.com/rhysd/actionlint).                                                                                     |
| `check-format`    | `cf`  | Verifies that the source code is clean and well-formatted with [Biome](https://biomejs.dev).                                                                                                     |
| `check-renovate`  | `cr`  | Verifies that the [Renovate](https://github.com/renovatebot/renovate) configuration file (`.github/renovate.json`) is valid.                                                                     |
| `check-types`     | `ct`  | Verifies that the source code is type-safe with [TypeScript](https://www.typescriptlang.org).                                                                                                    |
| `format`          | `f`   | Reformats the source code with [Biome](https://biomejs.dev).                                                                                                                                     |
| `install`         | `i`   | Installs all third-party dependencies with [mise-en-place](https://mise.jdx.dev) and [pnpm](https://pnpm.io) and (unless opted out) enables the Git hooks with [Lefthook](https://lefthook.dev). |
| `test`            | `t`   | Runs the entire unit test suite once with [Vitest](https://vitest.dev).                                                                                                                          |
| `vitest`          | `v`   | Starts the [Vitest UI](https://vitest.dev/guide/ui.html#vitest-ui) test explorer for continuous unit testing.                                                                                    |
| `yolo`            |       | Disables the Git hooks temporarily with [Lefthook](https://lefthook.dev).                                                                                                                        |
