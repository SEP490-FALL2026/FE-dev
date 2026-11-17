import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import axios from 'axios'
import { accessRequestSupplementAdd } from '~/shared/api/generated/operations/spend-submission/access-request-supplement-add'
import { accessRequestResubmit } from '~/shared/api/generated/operations/access-requests/access-request-resubmit'
import { getAccessRequestGetQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-get'
import { getAccessRequestEventListQueryKey } from '~/shared/api/generated/operations/access-requests/access-request-event-list'
import { getMeAccessRequestListQueryKey } from '~/shared/api/generated/operations/me/me-access-request-list'
import { getDepartmentAccessRequestListQueryKey } from '~/shared/api/generated/operations/access-requests/department-access-request-list'
import { requestContractErrorKey } from '../request-contract-errors'
import { RequestSupplementForm } from './request-supplement-form'
import type { SupplementBodyDto } from '~/shared/api/generated/model/spend-submission/supplementBodyDto'
import { ACCESS_REQUEST_ROUTING } from '../enums/access-request-routing'

import type { AccessRequestResponseDtoDataRequest } from '~/shared/api/generated/model/access-requests/accessRequestResponseDtoDataRequest'
import { SPEND_STAGE } from '../enums/spend-stage'

export function RequestRevision({
  id,
  group,
  departmentId,
  termMonths,
  request
}: {
  id: string
  group: boolean
  departmentId: string
  /** Current "Thời gian dùng" of the request; a supplement may only shorten it. */
  termMonths?: number | null
  request?: Pick<AccessRequestResponseDtoDataRequest, 'routing' | 'spend' | 'needDecision' | 'plan'>
}) {
  const { t } = useTranslation('requestFlow')
  const client = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [uncertain, setUncertain] = useState(false)
  const [retrySeconds, setRetrySeconds] = useState(0)
  useEffect(() => {
    if (!retrySeconds) return
    const timer = window.setTimeout(() => setRetrySeconds((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [retrySeconds])
  const locked = useRef(false)
  const canSupplement =
    request?.routing.mode === ACCESS_REQUEST_ROUTING.ONE_STEP &&
    request.spend?.stage === SPEND_STAGE.RETURNED_TO_REQUESTER
  const mutation = useMutation({
    retry: false,
    mutationFn: async (body?: SupplementBodyDto) => {
      if (!body) return accessRequestResubmit(id)
      if (!canSupplement) throw new Error('Supplement not allowed')
      return accessRequestSupplementAdd(id, body)
    },
    onSuccess: () => {
      setEditing(false)
      toast.success(t('saved'), { id: 'request-revision' })
    },
    onError: (error) => {
      const unknown = axios.isAxiosError(error) && (!error.response || error.response.status >= 500)
      if (unknown) setUncertain(true)
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const seconds = Number(error.response.headers['retry-after'] ?? 60)
        setRetrySeconds(Number.isFinite(seconds) ? Math.max(1, Math.ceil(seconds)) : 60)
      }
      toast.error(t(unknown ? 'outcomeUnknown' : (requestContractErrorKey(error) ?? 'error')), {
        id: 'request-revision'
      })
    },
    onSettled: async () => {
      await Promise.all(
        [
          getAccessRequestGetQueryKey(id),
          getAccessRequestEventListQueryKey(id),
          getMeAccessRequestListQueryKey(),
          getDepartmentAccessRequestListQueryKey(departmentId)
        ].map((queryKey) => client.invalidateQueries({ queryKey }))
      )
      locked.current = false
    }
  })
  const submit = (form?: SupplementBodyDto) => {
    if (!locked.current && !uncertain && !retrySeconds) {
      locked.current = true
      mutation.mutate(form)
    }
  }
  const buttonClass = 'min-h-11 rounded-md border border-border px-4 py-2 text-sm disabled:opacity-50'
  return (
    <section className='space-y-4 border-t border-border/60 pt-4'>
      <h3 className='font-semibold'>{t('returned')}</h3>
      {uncertain && (
        <div>
          <p role='status' className='text-sm text-warning'>
            {t('outcomeUnknown')}
          </p>
          <button className={buttonClass} onClick={() => window.location.reload()}>
            {t('reload')}
          </button>
        </div>
      )}
      {!!retrySeconds && (
        <p role='status' className='text-sm'>
          {t('retryAfter', { seconds: retrySeconds })}
        </p>
      )}
      {!canSupplement && <p className='text-sm text-muted-foreground'>{t('resubmitOnlyHint')}</p>}
      {canSupplement && editing && (
        <RequestSupplementForm
          id={id}
          planId={request?.plan?.planId}
          termMonths={termMonths}
          group={group}
          disabled={mutation.isPending || uncertain || !!retrySeconds}
          onSubmit={submit}
        />
      )}
      <div className='flex flex-wrap justify-end gap-3'>
        {canSupplement && (
          <button
            className={buttonClass}
            disabled={mutation.isPending || uncertain || !!retrySeconds}
            onClick={() => setEditing(!editing)}
          >
            {t(editing ? 'cancel' : 'revise')}
          </button>
        )}
        <button
          className={`${buttonClass} bg-primary text-primary-foreground`}
          aria-busy={mutation.isPending}
          disabled={mutation.isPending || uncertain || editing || !!retrySeconds}
          onClick={() => submit()}
        >
          {t('resubmit')}
        </button>
      </div>
    </section>
  )
}
