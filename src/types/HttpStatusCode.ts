export type HttpStatusCode =
	| typeof HTTP_200_OK
	| typeof HTTP_201_CREATED
	| typeof HTTP_202_ACCEPTED
	| typeof HTTP_204_NO_CONTENT
	| typeof HTTP_301_MOVED_PERMANENTLY
	| typeof HTTP_302_FOUND
	| typeof HTTP_304_NOT_MODIFIED
	| typeof HTTP_307_TEMPORARY_REDIRECT
	| typeof HTTP_308_PERMANENT_REDIRECT
	| typeof HTTP_400_BAD_REQUEST
	| typeof HTTP_401_UNAUTHORIZED
	| typeof HTTP_403_FORBIDDEN
	| typeof HTTP_404_NOT_FOUND
	| typeof HTTP_405_METHOD_NOT_ALLOWED
	| typeof HTTP_409_CONFLICT
	| typeof HTTP_410_GONE
	| typeof HTTP_422_UNPROCESSABLE_CONTENT
	| typeof HTTP_500_INTERNAL_SERVER_ERROR

export const HTTP_200_OK = 200
export const HTTP_201_CREATED = 201
export const HTTP_202_ACCEPTED = 202
export const HTTP_204_NO_CONTENT = 204
export const HTTP_301_MOVED_PERMANENTLY = 301
export const HTTP_302_FOUND = 302
export const HTTP_304_NOT_MODIFIED = 304
export const HTTP_307_TEMPORARY_REDIRECT = 307
export const HTTP_308_PERMANENT_REDIRECT = 308
export const HTTP_400_BAD_REQUEST = 400
export const HTTP_401_UNAUTHORIZED = 401
export const HTTP_403_FORBIDDEN = 403
export const HTTP_404_NOT_FOUND = 404
export const HTTP_405_METHOD_NOT_ALLOWED = 405
export const HTTP_409_CONFLICT = 409
export const HTTP_410_GONE = 410
export const HTTP_422_UNPROCESSABLE_CONTENT = 422
export const HTTP_500_INTERNAL_SERVER_ERROR = 500

export function httpStatusTextFromCode(statusCode: HttpStatusCode): string {
	switch (statusCode) {
		case HTTP_200_OK: {
			return "OK"
		}
		case HTTP_201_CREATED: {
			return "Created"
		}
		case HTTP_202_ACCEPTED: {
			return "Accepted"
		}
		case HTTP_204_NO_CONTENT: {
			return "No Content"
		}
		case HTTP_301_MOVED_PERMANENTLY: {
			return "Moved Permanently"
		}
		case HTTP_302_FOUND: {
			return "Found"
		}
		case HTTP_304_NOT_MODIFIED: {
			return "Not Modified"
		}
		case HTTP_307_TEMPORARY_REDIRECT: {
			return "Temporary Redirect"
		}
		case HTTP_308_PERMANENT_REDIRECT: {
			return "Permanent Redirect"
		}
		case HTTP_400_BAD_REQUEST: {
			return "Bad Request"
		}
		case HTTP_401_UNAUTHORIZED: {
			return "Unauthorized"
		}
		case HTTP_403_FORBIDDEN: {
			return "Forbidden"
		}
		case HTTP_404_NOT_FOUND: {
			return "Not Found"
		}
		case HTTP_405_METHOD_NOT_ALLOWED: {
			return "Method Not Allowed"
		}
		case HTTP_409_CONFLICT: {
			return "Conflict"
		}
		case HTTP_410_GONE: {
			return "Gone"
		}
		case HTTP_422_UNPROCESSABLE_CONTENT: {
			return "Unprocessable Content"
		}
		case HTTP_500_INTERNAL_SERVER_ERROR: {
			return "Internal Server Error"
		}
	}
}
