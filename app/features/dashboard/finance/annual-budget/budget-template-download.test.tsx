import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '~/shared/api/axios-client'
import { BudgetTemplateDownload } from './components/budget-template-download'
import { apiResponse, budgetTestLanguage, renderBudget } from './budget-test-fixtures'

describe('BM-10 template download', () => {
  const originalAdapter = apiClient.defaults.adapter
  let requests: { url?: string; params?: unknown }[] = []
  beforeEach(async () => {
    await budgetTestLanguage()
    requests = []
    URL.createObjectURL = vi.fn(() => 'blob:template')
    URL.revokeObjectURL = vi.fn()
    apiClient.defaults.adapter = async (config) => {
      requests.push({ url: config.url, params: config.params })
      return apiResponse(config, new Blob(['x']))
    }
  })
  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter
  })

  it('asks for the budget-proposal template as xlsx', async () => {
    renderBudget(<BudgetTemplateDownload />)
    fireEvent.click(screen.getByRole('button', { name: 'Download BM-10 template' }))
    await waitFor(() => expect(requests.length).toBe(1))
    expect(requests[0].url).toMatch(/\/import-templates\/budget-proposal$/)
    expect(requests[0].params).toEqual({ format: 'xlsx' })
  })
})
