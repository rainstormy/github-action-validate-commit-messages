import type { CometPlatform } from "utilities/platform/CometPlatform.ts"
import type { CometVersion } from "utilities/version/CometVersion.ts"

interface ViteTypeOptions {
	strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
	COMET_PLATFORM: CometPlatform
	COMET_VERSION: CometVersion
}

interface ImportMeta {
	env: ImportMetaEnv
}
