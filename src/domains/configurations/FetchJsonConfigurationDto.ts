import * as v from "valibot"
import {
	JSON_CONFIGURATION_DTO,
	type JsonConfigurationDto,
} from "#configurations/dtos/JsonConfigurationDto.ts"
import { readJsonFile } from "#utilities/files/Files.ts"

export async function fetchJsonConfigurationDto(path: string): Promise<JsonConfigurationDto> {
	const json = await readJsonFile(path)
	return v.parse(JSON_CONFIGURATION_DTO, json)
}
