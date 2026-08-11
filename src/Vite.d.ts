import type { CometVersion } from "utilities/version/CometVersion.ts"

interface ViteTypeOptions {
	strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
	COMET_VERSION: CometVersion
}

interface ImportMeta {
	env: ImportMetaEnv
}
