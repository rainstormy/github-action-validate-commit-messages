#!/usr/bin/env node

import process, { argv } from "node:process"
import { commandLineProgram } from "#programs/CommandLineProgram"
import type { ExitCode } from "#types/ExitCode"

const exitCode: ExitCode = await commandLineProgram(argv.slice(2))
process.exit(exitCode)
