/// <reference types="vite/client" />
/// <reference path="utilities/platform/CometPlatform" />
/// <reference path="utilities/version/CometVersion" />

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
