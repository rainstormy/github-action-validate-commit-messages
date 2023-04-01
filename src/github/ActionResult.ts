export type ActionResult = ActionFailed | ActionSucceeded

type ActionFailed = {
	readonly exitCode: 1
	readonly errors: ReadonlyArray<string>
}

type ActionSucceeded = {
	readonly exitCode: 0
}

export function actionSucceeded(): ActionSucceeded {
	return { exitCode: 0 }
}

export function actionFailed(errors: ReadonlyArray<string>): ActionFailed {
	return { exitCode: 1, errors }
}
