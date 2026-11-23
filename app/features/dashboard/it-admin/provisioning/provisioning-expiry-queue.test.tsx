import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import * as api from '~/shared/api/generated/operations/assignment-expiry'
import { ProvisioningExpiryQueue } from './components/provisioning-expiry-queue'
vi.mock('~/shared/api/generated/operations/assignment-expiry', async (original) => ({
  ...(await original<object>()),
  assignmentExpiryQueueList: vi.fn(),
  assignmentExpiryStartRevocation: vi.fn()
}))
describe('Expiry provisioning queue', () => {
  it('uses server status and requires confirmation before starting revocation', async () => {
    await setAppLanguage('en', false)
    vi.mocked(api.assignmentExpiryQueueList).mockResolvedValue({
      success: true,
      message: 'EXPIRY.LISTED',
      data: {
        items: [
          {
            assignmentId: 'assignment-1',
            employee: { id: 'employee-1', employeeCode: 'E1', fullName: 'Expired User' },
            department: null,
            plan: {
              planId: 'plan-1',
              planName: 'Business',
              applicationId: 'app-1',
              applicationName: 'Workspace',
              provisioningType: 'K2',
              dataLossOnRemoval: true
            },
            expectedEndDate: '2026-10-30',
            daysOverdue: 1,
            debt: false,
            status: 'READY_TO_REVOKE',
            pendingRenewal: null,
            revocation: null,
            handover: null
          }
        ],
        pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 }
      }
    })
    vi.mocked(api.assignmentExpiryStartRevocation).mockResolvedValue({
      success: true,
      message: 'REVOCATION.STARTED',
      data: null
    })
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <ProvisioningExpiryQueue onOpenTask={vi.fn()} />
      </QueryClientProvider>
    )
    expect(await screen.findByText('Expired User')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Start revocation' }))
    expect(api.assignmentExpiryStartRevocation).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toHaveTextContent('Removing this account can delete data')
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(api.assignmentExpiryStartRevocation).toHaveBeenCalledWith('assignment-1'))
  })
})
