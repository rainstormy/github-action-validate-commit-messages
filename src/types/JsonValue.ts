export type JsonValue = JsonArray | JsonObject | JsonPrimitive

export type JsonArray = Array<JsonValue>

export type JsonObject = {
	[key: string]: JsonValue
}

export type JsonPrimitive = boolean | number | string | null
