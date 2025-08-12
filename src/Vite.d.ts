interface ViteTypeOptions {
	strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
	VITE_TARGET_PLATFORM: "cli" | "gha"
}

interface ImportMeta {
	env: ImportMetaEnv
}
