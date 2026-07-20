/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BAIDU_MAP_AK: string
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  config: {
    baseURL: string
  }
}
