#!/usr/bin/env node

import process, { argv } from "node:process"
import { commandLineProgram } from "#programs/CommandLineProgram.ts"
import type { ExitCode } from "#types/ExitCode.ts"

const exitCode: ExitCode = await commandLineProgram(argv.slice(2))
process.exit(exitCode)
