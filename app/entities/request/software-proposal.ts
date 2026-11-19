import axios from 'axios'
import type { ProposalBodyDto } from '~/shared/api/generated/model'
import { readTermMonths, termMonthsPayload } from './term-months'

export function softwareProposalPayload(form: HTMLFormElement): ProposalBodyDto {
  const data = new FormData(form)
  const text = (key: string) => String(data.get(key) ?? '').trim()
  const existingApplicationId = text('existingApplicationId')
  return {
    softwareName: text('softwareName'),
    homepageUrl: text('homepageUrl'),
    purpose: text('purpose'),
    dataDescription: text('dataDescription'),
    expectedUsers: Number(data.get('expectedUsers')),
    ...termMonthsPayload(readTermMonths(data)),
    ...(existingApplicationId ? { existingApplicationId, plannedPlanName: text('plannedPlanName') } : {})
  }
}

export type ExistingSoftware = { applicationId: string; name: string; plans: { id: string; name: string }[] }
export function existingSoftwareFromError(error: unknown): ExistingSoftware | undefined {
  if (!axios.isAxiosError(error) || error.response?.data?.error?.code !== 'ACCESS_REQUEST.SOFTWARE_IN_CATALOG') return
  const existing = error.response.data.error.details?.existing
  if (!existing || typeof existing.applicationId !== 'string') return
  return {
    applicationId: existing.applicationId,
    name: typeof existing.name === 'string' ? existing.name : '',
    plans: Array.isArray(existing.plans)
      ? existing.plans
          .filter(
            (plan: { planId?: unknown; name?: unknown }) =>
              typeof plan.planId === 'string' && typeof plan.name === 'string'
          )
          .slice(0, 20)
          .map((plan: { planId: string; name: string }) => ({ id: plan.planId, name: plan.name }))
      : []
  }
}
