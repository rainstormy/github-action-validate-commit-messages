import typescriptPlugin from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import eslintCommentsPlugin from "eslint-plugin-eslint-comments"
import functionalPlugin from "eslint-plugin-functional"
import jestPlugin from "eslint-plugin-jest"
import redundantUndefinedPlugin from "eslint-plugin-redundant-undefined"
import unicornPlugin from "eslint-plugin-unicorn"
import { join as joinPath } from "node:path"
import { fileURLToPath } from "node:url"

const projectDirectory = joinPath(fileURLToPath(import.meta.url), "..")

/**
 * The last configuration takes precedence over the previous ones.
 *
 * @see https://eslint.org/docs/latest/user-guide/configuring
 * @type {ReadonlyArray<import("eslint").Linter.FlatConfig>}
 */
const eslintConfig = [
	{
		files: ["**/*.+(cjs|js|jsx|mjs|ts|tsx)"],
		ignores: [
			".git/**",
			".idea/**",
			".vscode/**",
			".yarn/**",
			"coverage/**",
			"node_modules/**",
			"release/**",
			".pnp.*",
		],
		languageOptions: {
			parser: "typescript/parser",
			parserOptions: {
				tsconfigRootDir: projectDirectory,
				project: ["./tsconfig.json"],
				sourceType: "module",
			},
		},
		plugins: {
			"eslint-comments": eslintCommentsPlugin,
			functional: functionalPlugin,
			"redundant-undefined": redundantUndefinedPlugin,
			typescript: {
				...typescriptPlugin,
				parsers: {
					// This is a workaround that allows us to use caching in ESLint along with a custom parser in the new ESLint configuration format.
					// See also: https://github.com/eslint/eslint/issues/16875
					parser: typescriptParser,
				},
			},
			unicorn: unicornPlugin,
		},
		/**
		 * @see https://eslint.org/docs/latest/rules eslint
		 * @see https://mysticatea.github.io/eslint-plugin-eslint-comments/rules eslint-comments
		 * @see https://github.com/eslint-functional/eslint-plugin-functional#supported-rules functional
		 * @see https://github.com/a-tarasyuk/eslint-plugin-redundant-undefined#rule-details redundant-undefined
		 * @see https://typescript-eslint.io/rules typescript
		 * @see https://github.com/sindresorhus/eslint-plugin-unicorn#rules unicorn
		 */
		rules: {
			"accessor-pairs": [
				"error",
				{
					setWithoutGet: true,
					getWithoutSet: false,
				},
			],
			"array-bracket-newline": "off", // Not applicable with Prettier.
			"array-bracket-spacing": "off", // Not applicable with Prettier.
			"array-callback-return": ["error", { allowImplicit: false }],
			"array-element-newline": "off", // Not applicable with Prettier.
			"arrow-body-style": ["error", "as-needed"], // Might conflict with Prettier. Please disable this rule if it does :)
			"arrow-parens": "off", // Not applicable with Prettier.
			"arrow-spacing": "off", // Not applicable with Prettier.
			"block-scoped-var": "off", // Not applicable with `no-var`.
			"block-spacing": "off", // Not applicable with Prettier.
			"brace-style": "off", // Not applicable with Prettier.
			camelcase: "off", // Overridden by `typescript/naming-convention`.
			"capitalized-comments": "off",
			"class-methods-use-this": "off",
			"comma-dangle": "off", // Not applicable with Prettier.
			"comma-spacing": "off", // Not applicable with Prettier.
			"comma-style": "off", // Not applicable with Prettier.
			complexity: "off",
			"computed-property-spacing": "off", // Not applicable with Prettier.
			"consistent-return": "off", // This rule does not work properly in exhaustive switch-statements.
			"consistent-this": "off", // Not applicable with `unicorn/no-this-assignment`.
			"constructor-super": "error",
			curly: "off", // Not applicable with Prettier.
			"default-case": "off",
			"default-case-last": "error",
			"default-param-last": "off", // Overridden by `typescript/default-param-last`.
			"dot-location": "off", // Not applicable with Prettier.
			"dot-notation": "off", // Overridden by `typescript/dot-notation`.
			"eol-last": "off", // Not applicable with Prettier.
			eqeqeq: ["error", "always"],
			"eslint-comments/disable-enable-pair": "error",
			"eslint-comments/no-aggregating-enable": "error",
			"eslint-comments/no-duplicate-disable": "error",
			"eslint-comments/no-restricted-disable": "off", // Not applicable with `eslint-comments/no-unlimited-disable`.
			"eslint-comments/no-unlimited-disable": "error",
			"eslint-comments/no-unused-disable": "error",
			"eslint-comments/no-unused-enable": "error",
			"eslint-comments/no-use": "off", // Not applicable with the other rules in eslint-comments.
			"eslint-comments/require-description": [
				"error",
				{
					ignore: ["eslint-enable"],
				},
			],
			"for-direction": "error",
			"func-call-spacing": "off", // Not applicable with Prettier.
			"func-name-matching": ["error", "always"],
			"func-names": ["error", "always"],
			"func-style": ["error", "declaration", { allowArrowFunctions: true }],
			"function-call-argument-newline": "off", // Not applicable with Prettier.
			"function-paren-newline": "off", // Not applicable with Prettier.
			"functional/functional-parameters": [
				"error",
				{
					allowRestParameter: true,
					allowArgumentsKeyword: false,
					enforceParameterCount: false,
				},
			],
			"functional/immutable-data": [
				"error",
				{
					assumeTypes: false, // Redundant with TypeScript.
					ignoreClasses: false,
					ignoreImmediateMutation: true,
					ignorePattern: [
						"\\.current", // Allows refs.
						"\\.value", // Allows signals.
						"document\\.", // Allows modifying document attributes.
						"location\\.href", // Allows programmatic navigation.
						"module\\.exports", // Allows CommonJS module exports.
					],
				},
			],
			"functional/no-classes": "off",
			"functional/no-conditional-statements": [
				"error",
				{
					allowReturningBranches: true,
				},
			],
			"functional/no-expression-statements": "off", // This rule would have disallowed class member assignments.
			"functional/no-let": "error",
			"functional/no-loop-statements": "error",
			"functional/no-mixed-type": "off", // This rule would have disallowed render props in components.
			"functional/no-promise-reject": "off",
			"functional/no-return-void": "off", // This rule would have disallowed event handlers in components.
			"functional/no-this-expressions": "off", // This rule would effectively have disallowed the use of classes.
			"functional/no-throw-statement": "off", // This rule would have disallowed throwing exceptions to indicate programming errors.
			"functional/no-try-statement": "off", // This rule would have disallowed interoperability with browser APIs and third-party libraries that throw exceptions.
			"functional/prefer-immutable-types": "off", // For now, this rule is disabled in favour of the deprecated `functional/prefer-readonly-type` which provides better feedback.
			"functional/prefer-property-signatures": "error",
			"functional/prefer-readonly-type": "error", // For now, this rule provides better feedback than its newer counterparts `functional/prefer-immutable-types` and `functional/type-declaration-immutability`.
			"functional/prefer-tacit": "off", // Not applicable with `unicorn/no-array-callback-reference`.
			"functional/readonly-type": ["error", "keyword"],
			"functional/type-declaration-immutability": "off", // This rule raises false positives on union types. See also: https://github.com/eslint-functional/eslint-plugin-functional/issues/529. For now, this rule is disabled in favour of the deprecated `functional/prefer-readonly-type` which provides better feedback.
			"generator-star-spacing": "off", // Not applicable with Prettier.
			"getter-return": ["error", { allowImplicit: false }],
			"grouped-accessor-pairs": ["error", "getBeforeSet"],
			"guard-for-in": "error",
			"id-denylist": "off",
			"id-length": ["error", { min: 2 }],
			"id-match": "off",
			"implicit-arrow-linebreak": "off", // Not applicable with Prettier.
			indent: "off", // Not applicable with Prettier.
			"init-declarations": "off", // Overridden by `typescript/init-declarations`.
			"jsx-quotes": "off", // Not applicable with Prettier.
			"key-spacing": "off", // Not applicable with Prettier.
			"keyword-spacing": "off", // Not applicable with Prettier.
			"line-comment-position": "off", // Not applicable with Prettier.
			"linebreak-style": "off", // Not applicable with Prettier.
			"lines-around-comment": "off", // Not applicable with Prettier.
			"lines-between-class-members": "off", // Overridden by `typescript/lines-between-class-members`.
			"max-classes-per-file": [
				"error",
				{
					ignoreExpressions: true,
					max: 1,
				},
			],
			"max-depth": ["error", { max: 4 }],
			"max-len": "off", // Not applicable with Prettier.
			"max-lines": "off",
			"max-lines-per-function": "off",
			"max-nested-callbacks": ["error", { max: 2 }],
			"max-params": ["error", { max: 6 }],
			"max-statements": "off",
			"max-statements-per-line": "off", // Not applicable with Prettier.
			"multiline-comment-style": ["error", "separate-lines"],
			"multiline-ternary": "off", // Not applicable with Prettier.
			"new-cap": "error",
			"new-parens": "off", // Not applicable with Prettier.
			"newline-per-chained-call": "off", // Not applicable with Prettier.
			"no-alert": "error",
			"no-array-constructor": "off", // Overridden by `typescript/no-array-constructor`.
			"no-async-promise-executor": "error",
			"no-await-in-loop": "error",
			"no-bitwise": "error",
			"no-caller": "error",
			"no-case-declarations": "error",
			"no-class-assign": "error",
			"no-compare-neg-zero": "error",
			"no-cond-assign": ["error", "always"],
			"no-confusing-arrow": "off", // Not applicable with Prettier.
			"no-console": ["error", { allow: ["debug", "info", "warn", "error"] }],
			"no-const-assign": "error",
			"no-constant-binary-expression": "error",
			"no-constant-condition": ["error", { checkLoops: true }],
			"no-constructor-return": "error",
			"no-continue": "error",
			"no-control-regex": "error",
			"no-debugger": "error",
			"no-delete-var": "error",
			"no-div-regex": "error",
			"no-dupe-args": "error",
			"no-dupe-class-members": "off", // Overridden by `typescript/no-dupe-class-members`.
			"no-dupe-else-if": "error",
			"no-dupe-keys": "error",
			"no-duplicate-case": "error",
			"no-duplicate-imports": "off", // Redundant with `prettier-plugin-organize-imports`.
			"no-else-return": ["error", { allowElseIf: false }],
			"no-empty": "error",
			"no-empty-character-class": "error",
			"no-empty-function": "off", // Overridden by `typescript/no-empty-function`.
			"no-empty-pattern": "error",
			"no-eq-null": "off", // Redundant with `eqeqeq`.
			"no-eval": "error",
			"no-ex-assign": "error",
			"no-extend-native": "error",
			"no-extra-bind": "error",
			"no-extra-boolean-cast": "error",
			"no-extra-label": "error",
			"no-extra-parens": "off", // Not applicable with Prettier.
			"no-extra-semi": "off", // Overridden by `typescript/no-extra-semi`.
			"no-fallthrough": "error",
			"no-floating-decimal": "off", // Not applicable with Prettier.
			"no-func-assign": "error",
			"no-global-assign": "error",
			"no-implicit-coercion": "error",
			"no-implicit-globals": "error",
			"no-implied-eval": "off", // Overridden by `typescript/no-implied-eval`.
			"no-import-assign": "error",
			"no-inline-comments": "off",
			"no-inner-declarations": "error",
			"no-invalid-regexp": "error",
			"no-invalid-this": "off", // Overridden by `typescript/no-invalid-this`.
			"no-irregular-whitespace": [
				"error",
				{
					skipStrings: false,
					skipComments: false,
					skipRegExps: false,
					skipTemplates: false,
				},
			],
			"no-iterator": "error",
			"no-label-var": "error",
			"no-labels": "error",
			"no-lone-blocks": "error",
			"no-lonely-if": "error",
			"no-loop-func": "off", // Overridden by `typescript/no-loop-func`.
			"no-loss-of-precision": "off", // Overridden by `typescript/no-loss-of-precision`.
			"no-magic-numbers": "off", // Overridden by `typescript/no-magic-numbers`.
			"no-misleading-character-class": "error",
			"no-mixed-operators": "error",
			"no-mixed-spaces-and-tabs": "off", // Not applicable with Prettier.
			"no-multi-assign": "error",
			"no-multi-spaces": "off", // Not applicable with Prettier.
			"no-multi-str": "error",
			"no-multiple-empty-lines": "off", // Not applicable with Prettier.
			"no-negated-condition": "off", // Overridden by `unicorn/no-negated-condition`.
			"no-nested-ternary": "off", // Overridden by `unicorn/no-nested-ternary`.
			"no-new": "error",
			"no-new-func": "error",
			"no-new-object": "error",
			"no-new-symbol": "error",
			"no-new-wrappers": "error",
			"no-nonoctal-decimal-escape": "error",
			"no-obj-calls": "error",
			"no-octal": "error",
			"no-octal-escape": "error",
			"no-param-reassign": "error",
			"no-plusplus": "error",
			"no-promise-executor-return": "error",
			"no-proto": "error",
			"no-prototype-builtins": "error",
			"no-redeclare": "off", // Overridden by `typescript/no-redeclare`.
			"no-regex-spaces": "error",
			"no-restricted-exports": "off",
			"no-restricted-globals": "off",
			"no-restricted-imports": "off", // Overridden by `typescript/no-restricted-imports`.
			"no-restricted-properties": "off",
			"no-restricted-syntax": [
				"error",
				{
					selector: "TSEnumDeclaration",
					message: "Prefer string literal types over enums",
				},
			],
			"no-return-assign": "error",
			"no-return-await": "error",
			"no-script-url": "error",
			"no-self-assign": "error",
			"no-self-compare": "error",
			"no-sequences": "error",
			"no-setter-return": "error",
			"no-shadow": "off", // Overridden by `typescript/no-shadow`.
			"no-shadow-restricted-names": "error",
			"no-sparse-arrays": "error",
			"no-tabs": "off", // Not applicable with Prettier.
			"no-template-curly-in-string": "error",
			"no-ternary": "off",
			"no-this-before-super": "error",
			"no-throw-literal": "off", // Overridden by `typescript/no-throw-literal`.
			"no-trailing-spaces": "off", // Not applicable with Prettier.
			"no-undef": "error",
			"no-undef-init": "off", // Not applicable with `init-declarations`.
			"no-undefined": "off",
			"no-underscore-dangle": "error",
			"no-unexpected-multiline": "error",
			"no-unmodified-loop-condition": "error",
			"no-unneeded-ternary": "error",
			"no-unreachable": "error",
			"no-unreachable-loop": "error",
			"no-unsafe-finally": "error",
			"no-unsafe-negation": "error",
			"no-unsafe-optional-chaining": "error",
			"no-unused-expressions": "off", // Overridden by `typescript/no-unused-expressions`.
			"no-unused-labels": "error",
			"no-unused-private-class-members": "error",
			"no-unused-vars": "off", // Overridden by `typescript/no-unused-vars`.
			"no-use-before-define": "off", // Overridden by `typescript/no-use-before-define`.
			"no-useless-backreference": "error",
			"no-useless-call": "error",
			"no-useless-catch": "error",
			"no-useless-computed-key": "error",
			"no-useless-concat": "error",
			"no-useless-constructor": "off", // Overridden by `typescript/no-useless-constructor`.
			"no-useless-escape": "error",
			"no-useless-rename": "error",
			"no-useless-return": "error",
			"no-var": "error",
			"no-void": "error",
			"no-warning-comments": "off", // Overridden by `unicorn/expiring-todo-comments`.
			"no-whitespace-before-property": "off", // Not applicable with Prettier.
			"no-with": "error",
			"nonblock-statement-body-position": "off", // Not applicable with Prettier.
			"object-curly-newline": "off", // Not applicable with Prettier.
			"object-curly-spacing": "off", // Not applicable with Prettier.
			"object-property-newline": "off", // Not applicable with Prettier.
			"object-shorthand": ["error", "always"],
			"one-var": ["error", "never"],
			"one-var-declaration-per-line": "off", // Not applicable with Prettier.
			"operator-assignment": "error",
			"operator-linebreak": "off", // Not applicable with Prettier.
			"padded-blocks": "off", // Not applicable with Prettier.
			"padding-line-between-statements": "off", // Not applicable with Prettier.
			"prefer-arrow-callback": "error", // Might conflict with Prettier. Please disable this rule if it does :)
			"prefer-const": "error",
			"prefer-destructuring": "off",
			"prefer-exponentiation-operator": "error",
			"prefer-named-capture-group": "error",
			"prefer-numeric-literals": "error",
			"prefer-object-has-own": "error", // Requires a polyfill for Safari < 15.4.
			"prefer-object-spread": "error",
			"prefer-promise-reject-errors": "error",
			"prefer-regex-literals": "error",
			"prefer-rest-params": "error",
			"prefer-spread": "error",
			"prefer-template": "error",
			"quote-props": "off", // Not applicable with Prettier.
			quotes: "off", // Not applicable with Prettier.
			radix: ["error", "as-needed"],
			"redundant-undefined/redundant-undefined": "error",
			"require-atomic-updates": "error",
			"require-await": "off", // Overridden by `typescript/require-await`.
			"require-unicode-regexp": "error",
			"require-yield": "error",
			"rest-spread-spacing": "off", // Not applicable with Prettier.
			semi: "off", // Not applicable with Prettier.
			"semi-spacing": "off", // Not applicable with Prettier.
			"semi-style": "off", // Not applicable with Prettier.
			"sort-imports": "off", // Not applicable with `prettier-plugin-organize-imports`.
			"sort-keys": "off", // This rule would change the program semantics, as the evaluation order of keys may change. Besides, why would you want `end` to appear before `start`? :P
			"sort-vars": "off", // Not applicable with `one-var`.
			"space-before-blocks": "off", // Not applicable with Prettier.
			"space-before-function-paren": "off", // Not applicable with Prettier.
			"space-in-parens": "off", // Not applicable with Prettier.
			"space-infix-ops": "off", // Not applicable with Prettier.
			"space-unary-ops": "off", // Not applicable with Prettier.
			"spaced-comment": ["error", "always", { markers: ["/"] }],
			strict: ["error", "never"],
			"switch-colon-spacing": "off", // Not applicable with Prettier.
			"symbol-description": "error",
			"template-curly-spacing": "off", // Not applicable with Prettier.
			"template-tag-spacing": "off", // Not applicable with Prettier.
			"typescript/adjacent-overload-signatures": "error",
			"typescript/array-type": ["error", { default: "generic" }],
			"typescript/await-thenable": "error",
			"typescript/ban-ts-comment": "error",
			"typescript/ban-tslint-comment": "error",
			"typescript/ban-types": [
				"error",
				{
					extendDefaults: true,
					types: {},
				},
			],
			"typescript/class-literal-property-style": ["error", "fields"],
			"typescript/consistent-generic-constructors": ["error", "constructor"],
			"typescript/consistent-indexed-object-style": ["error", "record"],
			"typescript/consistent-type-assertions": [
				"error",
				{
					assertionStyle: "as",
					objectLiteralTypeAssertions: "allow-as-parameter",
				},
			],
			"typescript/consistent-type-definitions": ["error", "type"],
			"typescript/consistent-type-exports": [
				"error",
				{
					fixMixedExportsWithInlineTypeSpecifier: true,
				},
			],
			"typescript/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					disallowTypeAnnotations: true,
				},
			],
			"typescript/default-param-last": "error",
			"typescript/dot-notation": "error",
			"typescript/explicit-function-return-type": [
				"error",
				{
					allowExpressions: true,
				},
			],
			"typescript/explicit-member-accessibility": [
				"error",
				{
					accessibility: "no-public",
				},
			],
			"typescript/explicit-module-boundary-types": "off", // Redundant with `typescript/explicit-function-return-type`.
			"typescript/init-declarations": ["error", "always"],
			"typescript/lines-between-class-members": "off", // Not applicable with Prettier.
			"typescript/member-ordering": "off", // This rule is not auto-fixable, which would have caused a poor developer experience. See also: https://github.com/typescript-eslint/typescript-eslint/issues/2296
			"typescript/method-signature-style": ["error", "property"],
			"typescript/naming-convention": [
				"error",
				{
					selector: "variableLike",
					format: [
						"strictCamelCase", // Default.
						"PascalCase", // Components.
					],
				},
				{
					selector: "variable",
					types: ["boolean"],
					format: ["PascalCase"],
					prefix: ["has", "is"],
				},
				{
					selector: "property",
					format: [
						"strictCamelCase", // Default.
						"PascalCase", // Components.
					],
					leadingUnderscore: "forbid",
				},
				{
					selector: "objectLiteralProperty",
					format: null, // Allows keys with special formatting such HTTP headers etc.
				},
				{
					selector: "typeLike",
					format: ["PascalCase"],
				},
			],
			"typescript/no-array-constructor": "error",
			"typescript/no-base-to-string": "error",
			"typescript/no-confusing-non-null-assertion": "error",
			"typescript/no-confusing-void-expression": [
				"error",
				{
					ignoreArrowShorthand: true,
					ignoreVoidOperator: true,
				},
			],
			"typescript/no-dupe-class-members": "error",
			"typescript/no-duplicate-enum-values": "off", // Not applicable with `no-restricted-syntax` that disallows enum declarations.
			"typescript/no-dynamic-delete": "error",
			"typescript/no-empty-function": "error",
			"typescript/no-empty-interface": "off", // Not applicable with `typescript/consistent-type-definitions`.
			"typescript/no-explicit-any": "error", // Encourages people to use the `unknown` type instead of `any`.
			"typescript/no-extra-non-null-assertion": "error",
			"typescript/no-extra-semi": "off", // Not applicable with Prettier.
			"typescript/no-extraneous-class": "off", // Redundant with `unicorn/no-static-only-class` which is auto-fixable.
			"typescript/no-floating-promises": "error",
			"typescript/no-for-in-array": "error",
			"typescript/no-implied-eval": "error",
			"typescript/no-inferrable-types": "error",
			"typescript/no-invalid-this": "error",
			"typescript/no-invalid-void-type": "error",
			"typescript/no-loop-func": "error",
			"typescript/no-loss-of-precision": "error",
			"typescript/no-magic-numbers": [
				"error",
				{
					ignore: [-1, 0, 1, 2],
					ignoreArrayIndexes: true,
					ignoreNumericLiteralTypes: true,
					ignoreTypeIndexes: true,
				},
			],
			"typescript/no-meaningless-void-operator": "error",
			"typescript/no-misused-new": "error",
			"typescript/no-misused-promises": [
				"error",
				{
					checksVoidReturn: false, // Allows asynchronous event handlers on DOM elements.
				},
			],
			"typescript/no-namespace": "off", // This rule would have disallowed nested type declarations in namespaces.
			"typescript/no-non-null-asserted-nullish-coalescing": "error",
			"typescript/no-non-null-asserted-optional-chain": "error",
			"typescript/no-non-null-assertion": "error",
			"typescript/no-redeclare": "off", // This rule would have disallowed nested type declarations in namespaces.
			"typescript/no-redundant-type-constituents": "error",
			"typescript/no-require-imports": "error",
			"typescript/no-restricted-imports": "off",
			"typescript/no-shadow": "error",
			"typescript/no-this-alias": "error",
			"typescript/no-throw-literal": "error",
			"typescript/no-type-alias": "off", // Not applicable with `typescript/consistent-type-definitions`.
			"typescript/no-unnecessary-boolean-literal-compare": "error",
			"typescript/no-unnecessary-condition": "error",
			"typescript/no-unnecessary-qualifier": "error",
			"typescript/no-unnecessary-type-arguments": "error",
			"typescript/no-unnecessary-type-assertion": "error",
			"typescript/no-unnecessary-type-constraint": "error",
			"typescript/no-unsafe-argument": "off", // Redundant with `typescript/no-explicit-any`.
			"typescript/no-unsafe-assignment": "off", // Redundant with `typescript/no-explicit-any`.
			"typescript/no-unsafe-call": "off", // Redundant with `typescript/no-explicit-any`.
			"typescript/no-unsafe-member-access": "off", // Redundant with `typescript/no-explicit-any`.
			"typescript/no-unsafe-return": "off", // Redundant with `typescript/no-explicit-any`.
			"typescript/no-unused-expressions": "error",
			"typescript/no-unused-vars": [
				"error",
				{
					ignoreRestSiblings: true,
					varsIgnorePattern: "[iI]gnored",
				},
			],
			"typescript/no-use-before-define": [
				"error",
				{
					classes: true, // Desired as classes are not hoisted.
					enums: false, // Not applicable with `no-restricted-syntax` that disallows enum declarations.
					functions: false, // This rule would have disallowed using the step-down rule by Uncle Bob (https://dzone.com/articles/the-stepdown-rule).
					typedefs: false, // This rule would have disallowed using the step-down rule by Uncle Bob (https://dzone.com/articles/the-stepdown-rule).
					variables: true, // Desired as local variables are not hoisted.
				},
			],
			"typescript/no-useless-constructor": "error",
			"typescript/no-useless-empty-export": "error",
			"typescript/no-var-requires": "error",
			"typescript/non-nullable-type-assertion-style": "error",
			"typescript/parameter-properties": [
				"error",
				{
					prefer: "parameter-property",
				},
			],
			"typescript/prefer-as-const": "error",
			"typescript/prefer-enum-initializers": "off", // Not applicable with `no-restricted-syntax` that disallows enum declarations.
			"typescript/prefer-for-of": "error",
			"typescript/prefer-function-type": "error",
			"typescript/prefer-includes": "error",
			"typescript/prefer-literal-enum-member": "off", // Not applicable with `no-restricted-syntax` that disallows enum declarations.
			"typescript/prefer-namespace-keyword": "error",
			"typescript/prefer-nullish-coalescing": "error",
			"typescript/prefer-optional-chain": "error",
			"typescript/prefer-readonly": "off", // Redundant with `functional/prefer-readonly-type`.
			"typescript/prefer-readonly-parameter-types": "off", // Overridden by `functional/prefer-readonly-type`.
			"typescript/prefer-reduce-type-parameter": "error",
			"typescript/prefer-regexp-exec": "error",
			"typescript/prefer-return-this-type": "error",
			"typescript/prefer-string-starts-ends-with": "error",
			"typescript/prefer-ts-expect-error": "error",
			"typescript/promise-function-async": "error",
			"typescript/require-array-sort-compare": "error",
			"typescript/require-await": "off", // Not applicable with `typescript/promise-function-async`.
			"typescript/restrict-plus-operands": "error",
			"typescript/restrict-template-expressions": "error",
			"typescript/return-await": "error",
			"typescript/sort-type-constituents": "error",
			"typescript/strict-boolean-expressions": "error",
			"typescript/switch-exhaustiveness-check": "error",
			"typescript/triple-slash-reference": "error",
			"typescript/typedef": "off", // Redundant with the `strict` flag in TypeScript.
			"typescript/unbound-method": "error",
			"typescript/unified-signatures": "error",
			"unicode-bom": "off", // Not applicable with Prettier.
			"unicorn/better-regex": "error",
			"unicorn/catch-error-name": "error",
			"unicorn/consistent-destructuring": "error",
			"unicorn/consistent-function-scoping": "error",
			"unicorn/custom-error-definition": "error",
			"unicorn/empty-brace-spaces": "off", // Not applicable with Prettier.
			"unicorn/error-message": "error",
			"unicorn/escape-case": "error",
			"unicorn/expiring-todo-comments": [
				"error",
				{
					allowWarningComments: false,
					ignore: [/\(#\d+\)|\([A-Z]+-\d+\)/u], // Ignores comments that include a GitHub or a Jira/YouTrack issue number in parentheses, e.g. (#1337) or (PROJECT-1337).
				},
			],
			"unicorn/explicit-length-check": "error",
			"unicorn/filename-case": [
				"error",
				{
					cases: {
						kebabCase: true,
						pascalCase: true,
					},
				},
			],
			"unicorn/import-style": [
				"error",
				{
					styles: {
						clsx: { default: false, named: true },
					},
				},
			],
			"unicorn/new-for-builtins": "error",
			"unicorn/no-abusive-eslint-disable": "off", // Redundant with `eslint-comments/no-unlimited-disable`.
			"unicorn/no-array-callback-reference": "error",
			"unicorn/no-array-for-each": "error",
			"unicorn/no-array-method-this-argument": "error",
			"unicorn/no-array-push-push": "error",
			"unicorn/no-array-reduce": "error",
			"unicorn/no-await-expression-member": "error",
			"unicorn/no-console-spaces": "error",
			"unicorn/no-document-cookie": "error",
			"unicorn/no-empty-file": "error",
			"unicorn/no-for-loop": "error",
			"unicorn/no-hex-escape": "error",
			"unicorn/no-instanceof-array": "error",
			"unicorn/no-invalid-remove-event-listener": "error",
			"unicorn/no-keyword-prefix": "off",
			"unicorn/no-lonely-if": "error",
			"unicorn/no-negated-condition": "error",
			"unicorn/no-nested-ternary": "off", // Not applicable with Prettier.
			"unicorn/no-new-array": "error",
			"unicorn/no-new-buffer": "error",
			"unicorn/no-null": "off", // We prefer null over undefined.
			"unicorn/no-object-as-default-parameter": "error",
			"unicorn/no-process-exit": "error",
			"unicorn/no-static-only-class": "error",
			"unicorn/no-thenable": "error",
			"unicorn/no-this-assignment": "off", // Redundant with `typescript/no-this-alias`.
			"unicorn/no-typeof-undefined": [
				"error",
				{
					checkGlobalVariables: true,
				},
			],
			"unicorn/no-unnecessary-await": "off", // Redundant with `typescript/await-thenable`.
			"unicorn/no-unreadable-array-destructuring": "error",
			"unicorn/no-unreadable-iife": "error",
			"unicorn/no-unsafe-regex": "error",
			"unicorn/no-unused-properties": "error",
			"unicorn/no-useless-fallback-in-spread": "error",
			"unicorn/no-useless-length-check": "error",
			"unicorn/no-useless-promise-resolve-reject": "error",
			"unicorn/no-useless-spread": "error",
			"unicorn/no-useless-switch-case": "error",
			"unicorn/no-useless-undefined": "off", // Not applicable with `init-declarations`.
			"unicorn/no-zero-fractions": "error",
			"unicorn/number-literal-case": "error",
			"unicorn/numeric-separators-style": "error",
			"unicorn/prefer-add-event-listener": "error",
			"unicorn/prefer-array-find": "error",
			"unicorn/prefer-array-flat": "error", // Requires a polyfill for Edge <= 18 (non-Chromium-based).
			"unicorn/prefer-array-flat-map": "error",
			"unicorn/prefer-array-index-of": "error",
			"unicorn/prefer-array-some": "error",
			"unicorn/prefer-at": "error", // Requires a polyfill for all major browsers until primo 2022.
			"unicorn/prefer-code-point": "error",
			"unicorn/prefer-date-now": "error",
			"unicorn/prefer-default-parameters": "error",
			"unicorn/prefer-dom-node-append": "error",
			"unicorn/prefer-dom-node-dataset": "error",
			"unicorn/prefer-dom-node-remove": "error",
			"unicorn/prefer-dom-node-text-content": "error",
			"unicorn/prefer-event-target": "error",
			"unicorn/prefer-export-from": "error",
			"unicorn/prefer-includes": "error",
			"unicorn/prefer-json-parse-buffer": "error",
			"unicorn/prefer-keyboard-event-key": "error",
			"unicorn/prefer-logical-operator-over-ternary": "error",
			"unicorn/prefer-math-trunc": "error",
			"unicorn/prefer-modern-dom-apis": "error",
			"unicorn/prefer-modern-math-apis": "error",
			"unicorn/prefer-module": "off", // This rule would have disallowed configuration files in CommonJS (*.cjs).
			"unicorn/prefer-native-coercion-functions": "error",
			"unicorn/prefer-negative-index": "error",
			"unicorn/prefer-node-protocol": "error",
			"unicorn/prefer-number-properties": "error",
			"unicorn/prefer-object-from-entries": "error",
			"unicorn/prefer-optional-catch-binding": "error",
			"unicorn/prefer-prototype-methods": "error",
			"unicorn/prefer-query-selector": "error",
			"unicorn/prefer-reflect-apply": "error",
			"unicorn/prefer-regexp-test": "error",
			"unicorn/prefer-set-has": "error",
			"unicorn/prefer-set-size": "error",
			"unicorn/prefer-spread": "error",
			"unicorn/prefer-string-replace-all": "error", // Requires a polyfill for all major browsers until medio 2020.
			"unicorn/prefer-string-slice": "error",
			"unicorn/prefer-string-starts-ends-with": "error",
			"unicorn/prefer-string-trim-start-end": "error",
			"unicorn/prefer-switch": "error",
			"unicorn/prefer-ternary": "error",
			"unicorn/prefer-top-level-await": "off", // This rule raises false positives on the `catch` function in Zod.
			"unicorn/prefer-type-error": "error",
			"unicorn/prevent-abbreviations": [
				"error",
				{
					checkProperties: true,
					ignore: [
						"^.*[dD]ev[s]?",
						"^.*[dD]ir[s]?",
						"^.*[eE]nv[s]?",
						"^.*[pP]rop[s]?",
						"^.*[rR]ef[s]?",
						"^.*[vV]ar[s]?",
					],
				},
			],
			"unicorn/relative-url-style": ["error", "never"],
			"unicorn/require-array-join-separator": "error",
			"unicorn/require-number-to-fixed-digits-argument": "error",
			"unicorn/require-post-message-target-origin": "error",
			"unicorn/string-content": [
				"error",
				{
					patterns: {
						// eslint-disable-next-line unicorn/string-content -- This particular string is appropriate, as it declares the multi-space pattern that we want to forbid :P
						"  ": {
							suggest: " ",
							message: "Replace multiple spaces with a single one.",
						},
					},
				},
			],
			"unicorn/switch-case-braces": ["error", "always"],
			"unicorn/template-indent": "error",
			"unicorn/text-encoding-identifier-case": "error",
			"unicorn/throw-new-error": "error",
			"use-isnan": "error",
			"valid-typeof": "error",
			"vars-on-top": "off", // Not applicable with `no-var`.
			"wrap-iife": "off", // Not applicable with Prettier.
			"wrap-regex": "off", // Not applicable with Prettier.
			"yield-star-spacing": "off", // Not applicable with Prettier.
			yoda: ["error", "never"],
		},
	},
	{
		files: ["**/*.config.+(cjs|js|jsx|mjs|ts|tsx)"],
		rules: {
			"unicorn/prevent-abbreviations": [
				"error",
				{
					checkProperties: true,
					ignore: ["^.*[dD]ir[s]?", "^.*[lL]ib[s]?", "^.*[vV]ar[s]?"],
				},
			],
		},
	},
	{
		files: ["**/*.config.cjs"],
		rules: {
			"typescript/no-require-imports": "off",
			"typescript/no-var-requires": "off",
		},
	},
	{
		files: ["**/*.tests.+(cjs|js|jsx|mjs|ts|tsx)"],
		languageOptions: {
			globals: {
				describe: "readonly",
				expect: "readonly",
				it: "readonly",
			},
		},
		plugins: {
			jest: jestPlugin, // The Vitest API is compatible with that of Jest whose ESLint support is more mature.
		},
		/**
		 * @see https://github.com/jest-community/eslint-plugin-jest#rules jest
		 */
		rules: {
			"jest/consistent-test-it": "error",
			"jest/expect-expect": "error",
			"jest/max-expects": ["error", { max: 6 }],
			"jest/max-nested-describe": ["error", { max: 4 }],
			"jest/no-alias-methods": "error",
			"jest/no-commented-out-tests": "error",
			"jest/no-conditional-expect": "error",
			"jest/no-conditional-in-test": "error",
			"jest/no-deprecated-functions": "off", // Not applicable with Vitest.
			"jest/no-disabled-tests": "error",
			"jest/no-done-callback": "error",
			"jest/no-duplicate-hooks": "error",
			"jest/no-export": "error",
			"jest/no-focused-tests": "error",
			"jest/no-hooks": "error",
			"jest/no-identical-title": "error",
			"jest/no-interpolation-in-snapshots": "error",
			"jest/no-jasmine-globals": "error",
			"jest/no-large-snapshots": "error",
			"jest/no-mocks-import": "error",
			"jest/no-restricted-jest-methods": "off", // Not applicable with Vitest.
			"jest/no-restricted-matchers": "error",
			"jest/no-standalone-expect": "error",
			"jest/no-test-prefixes": "error",
			"jest/no-test-return-statement": "error",
			"jest/no-untyped-mock-factory": "off", // Not applicable with Vitest.
			"jest/prefer-called-with": "error",
			"jest/prefer-comparison-matcher": "error",
			"jest/prefer-equality-matcher": "error",
			"jest/prefer-expect-assertions": "off",
			"jest/prefer-expect-resolves": "error",
			"jest/prefer-hooks-in-order": "off", // Not applicable with `jest/no-hooks`.
			"jest/prefer-hooks-on-top": "off", // Not applicable with `jest/no-hooks`.
			"jest/prefer-lowercase-title": [
				"error",
				{
					ignoreTopLevelDescribe: true,
				},
			],
			"jest/prefer-mock-promise-shorthand": "error",
			"jest/prefer-snapshot-hint": "error",
			"jest/prefer-spy-on": "error",
			"jest/prefer-strict-equal": "error",
			"jest/prefer-to-be": "error",
			"jest/prefer-to-contain": "error",
			"jest/prefer-to-have-length": "error",
			"jest/prefer-todo": "error",
			"jest/require-hook": "off", // Not applicable with `jest/no-hooks`.
			"jest/require-to-throw-message": "error",
			"jest/require-top-level-describe": "error",
			"jest/unbound-method": "error",
			"jest/valid-describe-callback": "off", // Vitest supports async callbacks in `describe` blocks.
			"jest/valid-expect": "error",
			"jest/valid-expect-in-promise": "error",
			"jest/valid-title": "error",
			"max-nested-callbacks": ["error", { max: 6 }], // Allows nested tests.
			"typescript/unbound-method": "off", // Overridden by `jest/unbound-method`.
		},
	},
	{
		files: [
			"**/*.+(fakes|dummies|mocks|spies|stubs|stories|tests).+(cjs|js|jsx|mjs|ts|tsx)",
		],
		rules: {
			"typescript/no-magic-numbers": "off", // This rule would have disallowed magic numbers in test data.
			"typescript/no-non-null-assertion": "off", // This rule would have disallowed non-null assertions in test data.
			"unicorn/numeric-separators-style": "off", // This rule would have disallowed article ids and Unix epoch timestamps in test data.
			"unicorn/string-content": "off", // This rule raises false positives on the alignment of template string tables (`each`) in Vitest.
		},
	},
]

export default eslintConfig
