// By using triple-slash references instead of overriding `compilerOptions.types` in `tsconfig.json`,
// we preserve the `@types/*` dependencies automatically being among the globally visible types.
//
// Read more:
// https://www.typescriptlang.org/tsconfig#types

/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
