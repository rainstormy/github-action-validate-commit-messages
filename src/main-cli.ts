#!/usr/bin/env node

import process, { argv } from "node:process"
import { commandLineProgram } from "#programs/CommandLineProgram"

const exitCode = await commandLineProgram(argv.slice(2))
process.exit(exitCode)
