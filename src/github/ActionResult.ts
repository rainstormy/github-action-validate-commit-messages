export type ActionResult =
	| ActionConfigurationMustBeValid
	| AllCommitsAreValid
	| SomeCommitsAreInvalid

type ActionConfigurationMustBeValid = {
	readonly exitCode: -1
	readonly errorMessage: string
}

export function actionConfigurationMustBeValid(
	errorMessage: string,
): ActionConfigurationMustBeValid {
	return { exitCode: -1, errorMessage }
}

type AllCommitsAreValid = {
	readonly exitCode: 0
}

export function allCommitsAreValid(): AllCommitsAreValid {
	return { exitCode: 0 }
}

type SomeCommitsAreInvalid = {
	readonly exitCode: 1
	readonly errorMessage: string
}

export function someCommitsAreInvalid(
	formattedReport: string,
): SomeCommitsAreInvalid {
	return { exitCode: 1, errorMessage: formattedReport }
}
