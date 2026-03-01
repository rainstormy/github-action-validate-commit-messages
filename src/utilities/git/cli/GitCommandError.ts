export class GitCommandError extends Error {
	exitCode: number | null

	constructor(props: {
		args: Array<string>
		exitCode?: number | null
		stderr?: string
		cause?: Error
	}) {
		super(
			[
				`Command 'git ${props.args.join(" ")}' failed`,
				props.exitCode ? ` with exit code ${props.exitCode}` : "",
				props.stderr ? `:\n\n${props.stderr.trim()}` : "",
			].join(""),
			{ cause: props.cause },
		)

		this.exitCode = props.exitCode ?? null
	}
}
