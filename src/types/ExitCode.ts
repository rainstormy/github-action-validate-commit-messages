export const EXIT_CODE_SUCCESS = 0
export const EXIT_CODE_GENERAL_ERROR = 1
export const EXIT_CODE_INVALID_INPUT = 2

export type ExitCode =
	| typeof EXIT_CODE_SUCCESS
	| typeof EXIT_CODE_GENERAL_ERROR
	| typeof EXIT_CODE_INVALID_INPUT
