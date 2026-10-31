import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type {
  GroupBodyDto,
  GroupCheckResponseDtoData,
  PreviewResponseDtoDataPreview,
  SubmitBodyDto
} from '~/shared/api/generated/model'
import { accessRequestSubmit } from '~/shared/api/generated/operations/access-requests/access-request-submit'
import { accessRequestPreview } from '~/shared/api/generated/operations/access-requests/access-request-preview'
import { accessRequestPropose } from '~/shared/api/generated/operations/access-requests/access-request-propose'
import { accessRequestRenewalSubmit } from '~/shared/api/generated/operations/access-requests/access-request-renewal-submit'
import { accessRequestDraftSave } from '~/shared/api/generated/operations/access-requests/access-request-draft-save'
import { getAccessRequestDraftListQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-draft-list'
import { groupRequestCheck } from '~/shared/api/generated/operations/group-requests/group-request-check'
import { groupRequestSubmit } from '~/shared/api/generated/operations/group-requests/group-request-submit'
import { returnRequestSubmit } from '~/shared/api/generated/operations/return-requests/return-request-submit'
import { getReturnRequestListQueryKey } from '~/shared/api/generated/operations/return-requests/return-request-list'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import { DRAFT_KIND } from '../../shared/enums/draft-kind'

export type RequestMode = 'individual' | 'group' | 'proposal' | 'renewal' | 'return'
export type GroupSelection = { employeeId: string; fullName: string; expectedEndDate: string }

export function readRequestFields(form: HTMLFormElement) {
  const fields = new FormData(form)
  const read = (name: string) => String(fields.get(name) ?? '').trim()
  return {
    planId: read('planId'),
    businessReason: read('businessReason'),
    termMonths: Number(read('termMonths')),
    ...(read('projectLabel') ? { projectLabel: read('projectLabel') } : {}),
    ...(read('expectedSpendOn') ? { expectedSpendOn: read('expectedSpendOn') } : {}),
    assignmentId: read('assignmentId'),
    newExpectedEndDate: read('newExpectedEndDate'),
    softwareName: read('softwareName'),
    homepageUrl: read('homepageUrl'),
    purpose: read('purpose'),
    dataDescription: read('dataDescription'),
    expectedUsers: Number(read('expectedUsers')),
    ...(read('termReason') ? { termConfirmation: { reason: read('termReason') } } : {})
  }
}

type Fields = ReturnType<typeof readRequestFields>
type PreviewResult = {
  fingerprint: string
  canSubmit: boolean
  preview?: PreviewResponseDtoDataPreview
  groupCheck?: NonNullable<GroupCheckResponseDtoData>
}
export function requestPayload(fields: Fields): SubmitBodyDto {
  const { planId, businessReason, termMonths, projectLabel, expectedSpendOn } = fields
  return {
    planId,
    businessReason,
    termMonths,
    ...(projectLabel ? { projectLabel } : {}),
    ...(expectedSpendOn ? { expectedSpendOn } : {})
  }
}

export function useLiveRequestForm(
  mode: RequestMode,
  onCreated: (id: string, returned?: boolean) => void,
  onDraftSaved: () => void
) {
  const [members, setMembers] = useState<GroupSelection[]>([])
  const feedback = useEmployeeFeedback([getAccessRequestDraftListQueryKey(), getReturnRequestListQueryKey()])
  const groupPayload = (fields: Fields): GroupBodyDto => ({
    ...requestPayload(fields),
    lines: members.map(({ employeeId, expectedEndDate }) => ({
      employeeId,
      ...(expectedEndDate ? { expectedEndDate } : {})
    })),
    ...(fields.termConfirmation ? { termConfirmation: fields.termConfirmation } : {})
  })
  const fingerprint = (fields: Fields) => JSON.stringify({ mode, fields, members })
  const preview = useMutation({
    retry: false,
    mutationFn: async (fields: Fields): Promise<PreviewResult> => {
      if (mode === 'group') {
        const response = await groupRequestCheck(groupPayload(fields))
        const checked = response.data
        return {
          fingerprint: fingerprint(fields),
          canSubmit:
            !!checked &&
            checked.plan.eligible === true &&
            !checked.tooManyLines &&
            checked.lines.length === members.length &&
            checked.lines.every((line) => line.ok),
          groupCheck: checked ?? undefined
        }
      }
      const { planId, termMonths, projectLabel, expectedSpendOn } = requestPayload(fields)
      const response = await accessRequestPreview({
        planId,
        termMonths,
        ...(projectLabel ? { projectLabel } : {}),
        ...(expectedSpendOn ? { expectedSpendOn } : {})
      })
      return {
        fingerprint: fingerprint(fields),
        canSubmit: response.data?.preview.canSubmit === true,
        preview: response.data?.preview
      }
    },
    onError: feedback.onReadError
  })
  const previewResult = preview.data ?? null
  const submit = useMutation({
    retry: false,
    mutationFn: async ({ fields, draft }: { fields: Fields; draft: boolean }) => {
      const payload = requestPayload(fields)
      if (draft) {
        if (mode === 'group') await accessRequestDraftSave({ ...groupPayload(fields), kind: DRAFT_KIND.GROUP })
        else await accessRequestDraftSave({ ...payload, kind: DRAFT_KIND.INDIVIDUAL })
        return { draft: true, id: undefined }
      }
      if (
        (mode === 'individual' || mode === 'group') &&
        (!previewResult?.canSubmit || previewResult.fingerprint !== fingerprint(fields))
      )
        throw new Error('Preview required')
      if (mode === 'individual') return { id: (await accessRequestSubmit(payload)).data?.request.id }
      if (mode === 'group') return { id: (await groupRequestSubmit(groupPayload(fields))).data?.request.id }
      if (mode === 'proposal') {
        const {
          softwareName,
          homepageUrl,
          purpose,
          dataDescription,
          expectedUsers,
          termMonths,
          projectLabel,
          expectedSpendOn
        } = fields
        return {
          id: (
            await accessRequestPropose({
              softwareName,
              homepageUrl,
              purpose,
              dataDescription,
              expectedUsers,
              termMonths,
              ...(projectLabel ? { projectLabel } : {}),
              ...(expectedSpendOn ? { expectedSpendOn } : {})
            })
          ).data?.request.id
        }
      }
      if (mode === 'renewal') {
        const { assignmentId, newExpectedEndDate, businessReason, projectLabel, expectedSpendOn, termConfirmation } =
          fields
        return {
          id: (
            await accessRequestRenewalSubmit({
              assignmentId,
              newExpectedEndDate,
              businessReason,
              ...(projectLabel ? { projectLabel } : {}),
              ...(expectedSpendOn ? { expectedSpendOn } : {}),
              ...(termConfirmation ? { termConfirmation } : {})
            })
          ).data?.request.id
        }
      }
      return {
        id: (await returnRequestSubmit({ assignmentId: fields.assignmentId, reason: fields.businessReason })).data
          ?.returnRequest.id,
        returned: true
      }
    },
    onSuccess: async (result) => {
      if (!result.draft && !result.id) {
        feedback.markUnknownOutcome()
        return
      }
      await feedback.onSuccess()
      if (!feedback.isActive()) return
      if (result.draft) onDraftSaved()
      else if (result.id) onCreated(result.id, result.returned)
    },
    onError: feedback.onError
  })
  return {
    members,
    setMembers,
    previewResult,
    clearPreview: () => preview.reset(),
    preview,
    submit,
    feedback,
    fingerprint
  }
}
