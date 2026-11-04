import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import { i18n } from '../app/shared/i18n/i18n'
import { resources } from '../app/shared/i18n/resources'

// Workflow tests use synchronous translations. Resource loading has its own tests.
for (const [language, namespaces] of Object.entries(resources)) {
  for (const [namespace, resource] of Object.entries(namespaces)) {
    i18n.addResourceBundle(language, namespace, resource)
  }
}

afterEach(cleanup)
