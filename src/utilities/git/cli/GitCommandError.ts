// oxlint-disable-next-line max-classes-per-file: Custom errors must extend the `Error` class.
export class GitCommandError extends Error {
	exitCode: number

	constructor(props: { args: Array<string>; exitCode: number; stderr?: string; cause?: Error }) {
		super(
			[
				`Command 'git ${props.args.join(" ")}' failed`,
				props.exitCode !== 0 ? ` with exit code ${props.exitCode}` : "",
				props.stderr !== undefined ? `:\n\n${props.stderr.trim()}` : "",
			].join(""),
			{ cause: props.cause },
		)

		this.exitCode = props.exitCode
	}
}
