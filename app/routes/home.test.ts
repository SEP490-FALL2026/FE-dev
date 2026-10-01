import { describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { meta } from './home'

describe('home route metadata', () => {
  it('uses localized landing metadata', async () => {
    await setAppLanguage('en', false)

    expect(meta({} as never)).toEqual([
      { title: 'SaaS-Sentry' },
      {
        name: 'description',
        content: 'Unify software spend, access, and usage evidence for better SaaS decisions.'
      }
    ])
  })
})
