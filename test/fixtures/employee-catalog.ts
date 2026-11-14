import { http, HttpResponse } from 'msw'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { expect } from 'vitest'
import type { RequestableApplicationResponseDtoData } from '../../app/shared/api/generated/model/requestable-software/requestableApplicationResponseDtoData'
import type { RequestablePlanPageResponseDtoDataItemsItem } from '../../app/shared/api/generated/model/requestable-software/requestablePlanPageResponseDtoDataItemsItem'
import type { RequestablePlanResponseDtoData } from '../../app/shared/api/generated/model/requestable-software/requestablePlanResponseDtoData'
import { pageResponse, planId } from './employee-api'

export const catalogApplication: NonNullable<RequestableApplicationResponseDtoData> = {
  id: planId,
  name: 'Test Software',
  kind: 'SAAS',
  vendorName: 'Test Vendor',
  functionalGroup: null,
  planCount: 1,
  costsMoney: true,
  canSubmit: true,
  submitBlockedReason: null,
  dataSensitivity: 'MEDIUM'
}
export const catalogPlan: RequestablePlanPageResponseDtoDataItemsItem = {
  id: planId,
  name: 'Standard',
  provisioningType: 'K1',
  application: { id: planId, name: 'Test Software', kind: 'SAAS' },
  price: { status: 'PRICED', missingReason: null },
  costsMoney: true,
  canSubmit: true,
  submitBlockedReason: null
}
export const catalogPlanDetails: NonNullable<RequestablePlanResponseDtoData> = {
  ...catalogPlan,
  vendorName: 'Test Vendor',
  sharingPolicy: 'NOT_ALLOWED',
  dataLossOnRemoval: true
}
export const employeeCatalogHandlers = [
  http.get('*/api/v1/me/department-transfer', () => HttpResponse.json({ success: true, data: null })),
  http.get('*/api/v1/me/departure-notice', () => HttpResponse.json({ success: true, data: null })),
  http.get('*/api/v1/me/department-software-list', () =>
    HttpResponse.json({
      ...pageResponse([
        {
          entryId: planId,
          applicationId: planId,
          applicationName: 'Test Software',
          planId: null,
          planName: null,
          note: null,
          addedAt: '2026-11-14'
        }
      ]),
      data: {
        ...pageResponse([
          {
            entryId: planId,
            applicationId: planId,
            applicationName: 'Test Software',
            planId: null,
            planName: null,
            note: null,
            addedAt: '2026-11-14'
          }
        ]).data,
        departmentId: planId
      }
    })
  ),
  http.get('*/api/v1/requestable-applications', () => HttpResponse.json(pageResponse([catalogApplication]))),
  http.get('*/api/v1/requestable-applications/:id', () =>
    HttpResponse.json({ success: true, data: catalogApplication })
  ),
  http.get('*/api/v1/requestable-plans', () => HttpResponse.json(pageResponse([catalogPlan]))),
  http.get('*/api/v1/requestable-plans/:id', () => HttpResponse.json({ success: true, data: catalogPlanDetails }))
]
export async function chooseCatalogPlan() {
  fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
  fireEvent.click(await screen.findByRole('option', { name: /Test Software/ }))
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software plan' })).toBeEnabled())
  fireEvent.click(screen.getByRole('combobox', { name: 'Software plan' }))
  fireEvent.click(await screen.findByRole('option', { name: /Standard/ }))
  const details = screen.queryByRole('region', { name: 'Selected plan details' })
  if (details) await waitFor(() => expect(within(details).queryByRole('status')).not.toBeInTheDocument())
}
