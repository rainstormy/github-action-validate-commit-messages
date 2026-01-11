/**
 * @see https://github.com/microsoft/TypeScript/issues/61321
 */
declare interface RegExpConstructor {
	escape(value: string): string
}
