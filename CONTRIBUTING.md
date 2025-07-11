# Contribution Guidelines

## Quick Start
- [Get started on 🍏 macOS](docs/quick-start/get-started-on-macos.md)
- [Get started on 🐧 Ubuntu](docs/quick-start/get-started-on-ubuntu.md)
- [Get started on 🟦 Windows](docs/quick-start/get-started-on-windows.md)

## Tasks
| Name        | Description                                                                                                             |
|-------------|-------------------------------------------------------------------------------------------------------------------------|
| `build`     | Generates production-grade build artefacts with [Vite](https://vite.dev).                                               |
| `check`     | Runs `check_fmt` and `check_ts`.                                                                                        |
| `check_fmt` | Verifies the code style of the source code with [Biome](https://biomejs.dev).                                           |
| `check_ts`  | Verifies the type safety of the source code with [TypeScript](https://www.typescriptlang.org).                          |
| `fmt`       | Reformats the source code with [Biome](https://biomejs.dev).                                                            |
| `init`      | Installs Node.js packages with [pnpm](https://pnpm.io) and enables the Git hooks with [Lefthook](https://lefthook.dev). |
| `test`      | Runs the entire unit test suite once with [Vitest](https://vitest.dev).                                                 |
| `vitest`    | Starts the [Vitest UI](https://vitest.dev/guide/ui.html#vitest-ui) test explorer for continuous unit testing.           |
| `yolo`      | Disables the Git hooks with [Lefthook](https://lefthook.dev).                                                           |

## Developer Guides
- [Manage third-party dependencies](docs/guides/manage-third-party-dependencies.md)
