import { GroupCheckResponseDtoDataLinesItemReason } from '~/shared/api/generated/model/group-requests/groupCheckResponseDtoDataLinesItemReason'
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

export type RequestMode = 'individual' | 'group' | 'proposal' | 'renewal' | 'return'
export type GroupSelection = {
  employeeId: string
  fullName: string
  workEmail?: string
  manyPaidSoftwareReason?: string
  reasonRequired?: boolean
}

export function readRequestFields(form: HTMLFormElement) {
  const fields = new FormData(form)
  const read = (name: string) => String(fields.get(name) ?? '').trim()
  return {
    planId: read('planId'),
    businessReason: read('businessReason'),
    expectedEndDate: read('expectedEndDate'),
    manyPaidSoftwareReason: read('manyPaidSoftwareReason'),
    assignmentId: read('assignmentId'),
    extensionMonths: Number(read('extensionMonths')),
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
  const { planId, businessReason, expectedEndDate, manyPaidSoftwareReason } = fields
  return {
    planId,
    businessReason,
    ...(expectedEndDate ? { expectedEndDate } : {}),
    ...(manyPaidSoftwareReason ? { manyPaidSoftwareReason } : {})
  }
}

export function useLiveRequestForm(
  mode: RequestMode,
  onCreated: (id: string, returned?: boolean) => void,
  onDraftSaved: () => void
) {
  const [members, setMembers] = useState<GroupSelection[]>([])
  const submitLock = useRef(false)
  const [requiresReason, setRequiresReason] = useState(false)
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
    ...(fields.expectedEndDate ? { expectedEndDate: fields.expectedEndDate } : {}),
    lines: members.map(({ employeeId, manyPaidSoftwareReason }) => ({
      employeeId,
      ...(manyPaidSoftwareReason?.trim() ? { manyPaidSoftwareReason: manyPaidSoftwareReason.trim() } : {})
    }))
  })
  const fingerprint = (fields: Fields) =>
    JSON.stringify({
      mode,
      planId: fields.planId,
      expectedEndDate: fields.expectedEndDate,
      members: members.map(({ employeeId, manyPaidSoftwareReason }) => ({ employeeId, manyPaidSoftwareReason }))
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
            !checked.endDateOutOfRange &&
            checked.lines.length === members.length &&
            checked.lines.every((line) => line.ok),
          groupCheck: checked ?? undefined
        }
      }
      const { planId, expectedEndDate } = requestPayload(fields)
      const response = await accessRequestPreview({
        planId,
        ...(expectedEndDate ? { expectedEndDate } : {})
      })
      return {
        fingerprint: fingerprint(fields),
        canSubmit: response.data?.preview.canSubmit === true,
        preview: response.data?.preview
      }
    },
    onError: feedback.onReadError,
    onSuccess: (result) => {
      setRequiresReason(result.preview?.limits.reasonRequired === true)
      if (result.groupCheck)
        setMembers((current) =>
          current.map((member) => ({
            ...member,
            reasonRequired:
              result.groupCheck?.lines.some(
                (line) =>
                  line.employeeId === member.employeeId &&
                  line.reason === GroupCheckResponseDtoDataLinesItemReason.MANY_PAID_SOFTWARE_REASON_REQUIRED
              ) || !!member.manyPaidSoftwareReason
          }))
        )
    }
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
        const { softwareName, homepageUrl, purpose, dataDescription, expectedUsers, expectedEndDate } = fields
        return {
          id: (
            await accessRequestPropose({
              softwareName,
              homepageUrl,
              purpose,
              dataDescription,
              expectedUsers,
              ...(expectedEndDate ? { expectedEndDate } : {})
            })
          ).data?.request.id
        }
      }
      if (mode === 'renewal') {
        const { assignmentId, extensionMonths, businessReason } = fields
        return {
          id: (
            await accessRequestRenewalSubmit({
              assignmentId,
              extensionMonths,
              businessReason
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
    onError: (error) => {
      if (
        axios.isAxiosError<{ error?: { code?: string } }>(error) &&
        (error.response?.status === 409 || error.response?.data.error?.code === 'GROUP_REQUEST.LINES_REFUSED')
      )
        preview.reset()
      if (
        axios.isAxiosError<{ error?: { code?: string } }>(error) &&
        error.response?.data.error?.code === 'ACCESS_REQUEST.MANY_PAID_SOFTWARE_REASON_REQUIRED'
      )
        setRequiresReason(true)
      return feedback.onError(error)
    },
    onSettled: () => {
      submitLock.current = false
    }
  })
  return {
    members,
    requiresReason,
    setMembers,
    previewResult,
    clearPreview: () => {
      preview.reset()
      setRequiresReason(false)
    },
    preview,
    submit: {
      ...submit,
      mutate: (variables: Parameters<typeof submit.mutate>[0]) => {
        if (!submitLock.current && !feedback.blocked) {
          submitLock.current = true
          submit.mutate(variables)
        }
      }
    },
    feedback,
    fingerprint
  }
}
