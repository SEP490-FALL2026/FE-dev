import { http, HttpResponse } from 'msw'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'
import type { RequestableApplicationResponseDtoData } from '../../app/shared/api/generated/model/requestable-software/requestableApplicationResponseDtoData'
import type { RequestablePlanPageResponseDtoDataItemsItem } from '../../app/shared/api/generated/model/requestable-software/requestablePlanPageResponseDtoDataItemsItem'
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
export const employeeCatalogHandlers = [
  http.get('*/api/v1/requestable-applications', () => HttpResponse.json(pageResponse([catalogApplication]))),
  http.get('*/api/v1/requestable-applications/:id', () =>
    HttpResponse.json({ success: true, data: catalogApplication })
  ),
  http.get('*/api/v1/requestable-plans', () => HttpResponse.json(pageResponse([catalogPlan])))
]
export async function chooseCatalogPlan() {
  fireEvent.click(screen.getByRole('combobox', { name: 'Software' }))
  fireEvent.click(await screen.findByRole('option', { name: /Test Software/ }))
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Software plan' })).toBeEnabled())
  fireEvent.click(screen.getByRole('combobox', { name: 'Software plan' }))
  fireEvent.click(await screen.findByRole('option', { name: /Standard/ }))
}
