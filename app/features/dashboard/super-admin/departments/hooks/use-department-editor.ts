import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { DepartmentResponseDtoData, UpdateDepartmentBodyDto } from '~/shared/api/generated/model'
import { getMeGetQueryOptions } from '~/shared/api/generated/operations/me/me-get'
import {
  getDepartmentGetQueryOptions,
  getDepartmentGetQueryKey,
  getDepartmentListQueryKey,
  useDepartmentUpdate,
  useDepartmentHeadAssign,
  useDepartmentHeadVacate
} from '~/shared/api/generated/operations/departments'
import { getAdminError } from '../../shared/hooks/admin-errors'
import { recordAdminRetryDelay } from '../../shared/hooks/use-admin-retry-delay'
import { organizationSummaryQueryKeys } from './organization-query-keys'

type Department = NonNullable<DepartmentResponseDtoData>
export type HeadChange = 'keep' | 'assign' | 'vacate'
export type DepartmentEditorDraft = {
  name: string
  function: string | null
  itAdminEmployeeId: string | null
  headChange: HeadChange
  employeeId: string
  effectiveFrom: string
}
const fieldErrors = {
  'DEPARTMENT.NAME_INVALID': 'name',
  'DEPARTMENT.IT_ADMIN_INVALID': 'itAdmin',
  'DEPARTMENT.HEAD_NOT_A_MEMBER_ON_DATE': 'headMembership',
  'DEPARTMENT.HEAD_MANAGER_ROLE_REQUIRED': 'managerRequired',
  'DEPARTMENT.HEAD_SPENDING_APPROVER_CANNOT_HEAD': 'headRole',
  'DEPARTMENT.HEAD_SUPER_ADMIN_CANNOT_HEAD': 'headRole',
  'DEPARTMENT.HEAD_HEADS_ANOTHER_DEPARTMENT': 'anotherDepartment',
  'DEPARTMENT.HEAD_EMPLOYEE_NOT_ACTIVE': 'employeeInactive',
  'DEPARTMENT.HEAD_EMPLOYEE_NOT_FOUND': 'employeeInactive',
  'DEPARTMENT.HEAD_DATE_IN_PAST': 'date',
  'DEPARTMENT.INACTIVE': 'inactive',
  VALIDATION_ERROR: 'validation'
} as const

export function useDepartmentEditor(department: Department | undefined, onClose: () => void) {
  const { t: translate } = useTranslation('adminOrganization')
  const { t: translateAdmin } = useTranslation('admin')
  const queryClient = useQueryClient()
  const baseline = useRef(department)
  const inFlight = useRef(false)
  const [pending, setPending] = useState(false)
  const [fieldError, setFieldError] = useState<keyof typeof fieldErrors | null>(null)
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())
  const [reviewRequired, setReviewRequired] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [latest, setLatest] = useState<Department | null>(null)
  const update = useDepartmentUpdate({ mutation: { retry: false } })
  const assign = useDepartmentHeadAssign({ mutation: { retry: false } })
  const vacate = useDepartmentHeadVacate({ mutation: { retry: false } })
  const refresh = async () => {
    await Promise.all(
      [...organizationSummaryQueryKeys, getDepartmentListQueryKey()].map((queryKey) =>
        queryClient.invalidateQueries({ queryKey })
      )
    )
  }
  const readLatest = async () => {
    if (!department) return null
    const response = await queryClient.fetchQuery({
      ...getDepartmentGetQueryOptions(department.id),
      queryKey: [...getDepartmentGetQueryKey(department.id), 'editor-readback'],
      staleTime: 0,
      retry: false
    })
    if (!response.data) throw new Error('Department unavailable')
    queryClient.setQueryData(getDepartmentGetQueryKey(department.id), response)
    baseline.current = response.data
    setLatest(response.data)
    return response.data
  }
  const reread = async () => {
    if (inFlight.current) return
    inFlight.current = true
    setPending(true)
    try {
      await readLatest()
    } catch {
      toast.error(translate('editor.readFailed'), { id: 'admin-department-edit' })
    } finally {
      inFlight.current = false
      setPending(false)
    }
  }
  const save = async (draft: DepartmentEditorDraft) => {
    const original = baseline.current
    if (!original || inFlight.current || (reviewRequired && (!reviewed || !latest))) return
    if (!draft.name || draft.name.length > 200 || (draft.function?.length ?? 0) > 1000) {
      setFieldError('DEPARTMENT.NAME_INVALID')
      return
    }
    if (draft.headChange !== 'keep' && (!draft.effectiveFrom || (draft.headChange === 'assign' && !draft.employeeId))) {
      setFieldError('VALIDATION_ERROR')
      return
    }
    inFlight.current = true
    setPending(true)
    setFieldError(null)
    setInvalidFields(new Set())
    let detailsSaved = false
    try {
      const patch: UpdateDepartmentBodyDto = {
        ...(draft.name !== original.name ? { name: draft.name } : {}),
        ...(draft.function !== original.function ? { function: draft.function } : {}),
        ...(draft.itAdminEmployeeId !== (original.itAdmin?.employeeId ?? null)
          ? { itAdminEmployeeId: draft.itAdminEmployeeId }
          : {})
      }
      if (Object.keys(patch).length) {
        const response = await update.mutateAsync({ id: original.id, data: patch })
        detailsSaved = true
        if (response.data) baseline.current = response.data
        else await readLatest()
      }
      if (draft.headChange === 'assign') {
        await assign.mutateAsync({
          id: original.id,
          data: {
            employeeId: draft.employeeId,
            effectiveFrom: draft.effectiveFrom
          }
        })
      } else if (draft.headChange === 'vacate') {
        await vacate.mutateAsync({ id: original.id, data: { effectiveFrom: draft.effectiveFrom } })
      }
      await readLatest()
      await refresh()
      toast.success(translateAdmin('saved'), { id: 'admin-department-edit' })
      onClose()
    } catch (error: unknown) {
      recordAdminRetryDelay(queryClient, error)
      const failure = getAdminError(error)
      setInvalidFields(failure.invalidFields)
      if (failure.key === 'forbidden') {
        await queryClient
          .fetchQuery({ ...getMeGetQueryOptions(), staleTime: 0, retry: false, networkMode: 'always' })
          .catch(() => undefined)
      }
      const uncertain = failure.key === 'unknownOutcome' || failure.key === 'unavailable'
      if (uncertain) {
        setReviewRequired(true)
        setReviewed(false)
        setLatest(null)
        try {
          await readLatest()
        } catch {
          /* The retry control stays available; writes remain blocked. */
        }
      } else if (Object.hasOwn(fieldErrors, failure.code)) {
        setFieldError(failure.code as keyof typeof fieldErrors)
      }
      if (!uncertain && detailsSaved) {
        try {
          await readLatest()
        } catch {
          /* Keep the accepted PATCH baseline and the unsaved head draft. */
        }
      }
      await refresh()
      toast.error(
        uncertain
          ? translate('editor.unknownOutcome')
          : detailsSaved
            ? translate('editor.partialSave')
            : translateAdmin(`errors.${failure.key}`),
        { id: 'admin-department-edit' }
      )
      if (failure.key === 'missing') onClose()
    } finally {
      inFlight.current = false
      setPending(false)
    }
  }
  return {
    invalidFields,
    save,
    pending,
    reviewRequired,
    reviewed,
    setReviewed,
    latest,
    reread,
    fieldError: fieldError ? { code: fieldError, message: translate(`editor.errors.${fieldErrors[fieldError]}`) } : null
  }
}
