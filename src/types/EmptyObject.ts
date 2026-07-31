declare const __contents: unique symbol

/**
 * Represents the literal `{}` instance.
 */
export type EmptyObject = { [__contents]?: never }
