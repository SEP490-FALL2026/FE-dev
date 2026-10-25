import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { ItDeviceCollectorsView } from './views/it-device-collectors-view'

afterEach(async () => setAppLanguage('vi', false))

describe('IT usage metrics localization', () => {
  it('translates department cards and usage labels', async () => {
    await setAppLanguage('en', false)
    render(<ItDeviceCollectorsView />)

    expect(screen.getByText('Department usage data')).toBeInTheDocument()
    expect(screen.getAllByText('Software Engineering').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/minutes ago/).length).toBeGreaterThan(0)
    expect(screen.queryByText('Dữ liệu sử dụng theo phòng ban')).not.toBeInTheDocument()
  })
})
