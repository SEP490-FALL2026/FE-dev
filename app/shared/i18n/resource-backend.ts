import type { BackendModule } from 'i18next'

import { namespaceLoaders } from './namespace-loaders'
import type { SupportedLanguage, TranslationNamespace } from './resources'

export const resourceBackend: BackendModule = {
  type: 'backend',
  init: () => undefined,
  read(language, namespace, callback) {
    const load = namespaceLoaders[language as SupportedLanguage]?.[namespace as TranslationNamespace]
    if (!load) {
      callback(new Error(`Unsupported translation resource: ${language}/${namespace}`), false)
      return
    }
    void load().then(
      (resource) => callback(null, resource),
      (error: unknown) => callback(error instanceof Error ? error : new Error(String(error)), false)
    )
  }
}
