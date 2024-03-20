# Manage third-party dependencies
This project distinguishes between runtime and development dependencies, as
declared by the `dependencies` and `devDependencies` fields in `package.json`.

> [!IMPORTANT]  
> A dependency is a runtime dependency when it is imported by any file with
> production source code. Preferably, runtime dependencies should not have any
> transitive dependencies.

Use the `// dependencies` and `// devDependencies` fields in `package.json` to
associate each dependency with a maintenance comment or a description that
justifies its use in this project.

| Task                                     | Description                                                                      |
|------------------------------------------|----------------------------------------------------------------------------------|
| `pnpm add <npm-package-name>`            | [Install](https://pnpm.io/cli/add) a runtime dependency.                         |
| `pnpm add --save-dev <npm-package-name>` | Install a development dependency.                                                |
| `pnpm dedupe`                            | [De-duplicate](https://pnpm.io/cli/dedupe) transitive dependencies.              |
| `pnpm remove <npm-package-name>`         | [Uninstall](https://pnpm.io/cli/remove) a dependency.                            |
| `pnpm up --latest`                       | [Upgrade](https://pnpm.io/cli/update) all dependencies to their latest versions. |
| `pnpm up --latest --interactive`         | Select a set of dependencies to upgrade to their latest versions.                |
| `pnpm up <npm-package-name>@<version>`   | Upgrade a single dependency to a particular version.                             |
