import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
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
import { getMeAccessRequestListQueryKey } from '~/shared/api/generated/operations/me/me-access-request-list'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import { DRAFT_KIND } from '../../shared/enums/draft-kind'
import { getMeSoftwareRightListQueryKey } from '~/shared/api/generated/operations/me/me-software-right-list'
import axios from 'axios'
import { getMeDepartmentTransferGetQueryKey } from '~/shared/api/generated/operations/me/me-department-transfer-get'
import { readTermMonths, termMonthsPayload } from '~/entities/request/term-months'

export type RequestMode = 'individual' | 'group' | 'proposal' | 'renewal' | 'return'
export type GroupSelection = {
  employeeId: string
  fullName: string
  workEmail?: string
}

export function readRequestFields(form: HTMLFormElement) {
  const fields = new FormData(form)
  const read = (name: string) => String(fields.get(name) ?? '').trim()
  return {
    planId: read('planId'),
    businessReason: read('businessReason'),
    termMonths: readTermMonths(fields),
    assignmentId: read('assignmentId'),
    extensionMonths: Number(read('extensionMonths')),
    longTerm: read('longTerm') === 'on',
    softwareName: read('softwareName'),
    homepageUrl: read('homepageUrl'),
    purpose: read('purpose'),
    dataDescription: read('dataDescription'),
    expectedUsers: Number(read('expectedUsers'))
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
  const { planId, businessReason, termMonths } = fields
  return { planId, businessReason, ...termMonthsPayload(termMonths) }
}

export function useLiveRequestForm(
  mode: RequestMode,
  onCreated: (id: string, returned?: boolean) => void,
  onDraftSaved: () => void
) {
  const [renewalWindow, setRenewalWindow] = useState<{ assignmentId: string; opensOn?: string } | null>(null)
  const [members, setMembers] = useState<GroupSelection[]>([])
  const submitLock = useRef(false)
  const feedback = useEmployeeFeedback([
    getAccessRequestDraftListQueryKey(),
    getReturnRequestListQueryKey(),
    getMeSoftwareRightListQueryKey(),
    getMeAccessRequestListQueryKey(),
    getMeDepartmentTransferGetQueryKey()
  ])
  const groupPayload = (fields: Fields): GroupBodyDto => ({
    planId: fields.planId,
    businessReason: fields.businessReason,
    ...termMonthsPayload(fields.termMonths),
    lines: members.map(({ employeeId }) => ({ employeeId }))
  })
  const fingerprint = (fields: Fields) =>
    JSON.stringify({
      mode,
      planId: fields.planId,
      termMonths: fields.termMonths ?? null,
      members: members.map(({ employeeId }) => employeeId)
    })
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
            !checked.tooFewLines &&
            !checked.tooManyLines &&
            !checked.termRefusal &&
            checked.lines.length === members.length &&
            checked.lines.every((line) => line.ok),
          groupCheck: checked ?? undefined
        }
      }
      const response = await accessRequestPreview({ planId: fields.planId, ...termMonthsPayload(fields.termMonths) })
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
        const { softwareName, homepageUrl, purpose, dataDescription, expectedUsers, termMonths } = fields
        return {
          id: (
            await accessRequestPropose({
              softwareName,
              homepageUrl,
              purpose,
              dataDescription,
              expectedUsers,
              ...termMonthsPayload(termMonths)
            })
          ).data?.request.id
        }
      }
      if (mode === 'renewal') {
        const { assignmentId, extensionMonths, longTerm, businessReason } = fields
        return {
          id: (
            await accessRequestRenewalSubmit({
              assignmentId,
              businessReason,
              ...(longTerm ? { longTerm: true as const } : { extensionMonths })
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
    onError: (error, variables) => {
      if (
        axios.isAxiosError<{ error?: { code?: string; details?: { opensOn?: string } } }>(error) &&
        error.response?.data.error?.code === 'RENEWAL_REQUEST.WINDOW_NOT_OPEN'
      ) {
        setRenewalWindow({
          assignmentId: variables.fields.assignmentId,
          opensOn: error.response.data.error.details?.opensOn
        })
      }
      if (
        axios.isAxiosError<{ error?: { code?: string } }>(error) &&
        (error.response?.status === 409 ||
          error.response?.status === 422 ||
          error.response?.data.error?.code === 'GROUP_REQUEST.LINES_REFUSED')
      )
        preview.reset()
      return feedback.onError(error)
    },
    onSettled: () => {
      submitLock.current = false
    }
  })
  return {
    renewalWindow,
    members,
    setMembers,
    previewResult,
    clearPreview: () => preview.reset(),
    preview,
    submit: {
      ...submit,
      mutate: (variables: Parameters<typeof submit.mutate>[0]) => {
        if (
          !submitLock.current &&
          !feedback.blocked &&
          !(mode === 'renewal' && renewalWindow?.assignmentId === variables.fields.assignmentId)
        ) {
          submitLock.current = true
          submit.mutate(variables)
        }
      }
    },
    feedback,
    fingerprint
  }
}
