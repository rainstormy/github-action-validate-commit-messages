declare const __contents: unique symbol

export type EmptyObject = { [__contents]?: never }
