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
import { useAccessRequestLineList } from '~/shared/api/generated/operations/group-requests/access-request-line-list'
import { requestContractErrorKey } from '../request-contract-errors'

export function RequestRevision({
  id,
  group,
  departmentId,
  maxEndDate
}: {
  id: string
  group: boolean
  departmentId: string
  maxEndDate?: string | null
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
  const [drop, setDrop] = useState<string[]>([])
  const [endDate, setEndDate] = useState('')
  const lines = useAccessRequestLineList(id, { page: 1, pageSize: 100 }, { query: { enabled: group && editing } })
  const mutation = useMutation({
    retry: false,
    mutationFn: async (form?: FormData) => {
      if (!form) return accessRequestResubmit(id)
      const expectedEndDate = String(form.get('expectedEndDate') ?? '')
      return accessRequestSupplementAdd(id, {
        reason: String(form.get('reason')).trim(),
        ...(expectedEndDate ? { expectedEndDate } : {}),
        ...(drop.length ? { dropEmployeeIds: drop } : {})
      })
    },
    onSuccess: () => {
      setEditing(false)
      setDrop([])
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
  const submit = (form?: FormData) => {
    if (!locked.current && !uncertain && !retrySeconds) {
      locked.current = true
      mutation.mutate(form)
    }
  }
  const inputClass = 'min-h-11 w-full rounded-md border border-border bg-background p-3 text-base md:text-sm'
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
      {editing && (
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            if (form.get('expectedEndDate') || drop.length) submit(form)
          }}
        >
          <fieldset disabled={mutation.isPending || uncertain || !!retrySeconds} className='space-y-4'>
            <label className='grid gap-2 text-sm'>
              {t('endDate')}
              <input
                className={inputClass}
                type='date'
                name='expectedEndDate'
                max={maxEndDate ?? undefined}
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </label>
            {group && (
              <div>
                <p className='text-sm'>{t('dropMembers')}</p>
                {lines.isError ? (
                  <button type='button' className={buttonClass} onClick={() => void lines.refetch()}>
                    {t('retry')}
                  </button>
                ) : (
                  lines.data?.data?.items.map((line) => (
                    <label key={line.employee.employeeId} className='flex min-h-11 items-center gap-2 text-sm'>
                      <input
                        type='checkbox'
                        checked={drop.includes(line.employee.employeeId)}
                        onChange={(event) =>
                          setDrop((old) =>
                            event.target.checked
                              ? [...old, line.employee.employeeId]
                              : old.filter((value) => value !== line.employee.employeeId)
                          )
                        }
                      />
                      {line.employee.fullName}
                    </label>
                  ))
                )}
              </div>
            )}
            <label className='grid gap-2 text-sm'>
              {t('supplement')}
              <textarea className={inputClass} name='reason' required maxLength={1000} rows={3} />
            </label>
            <button
              className={buttonClass}
              type='submit'
              aria-busy={mutation.isPending}
              disabled={!endDate && !drop.length}
            >
              {t('save')}
            </button>
          </fieldset>
        </form>
      )}
      <div className='flex flex-wrap justify-end gap-3'>
        <button
          className={buttonClass}
          disabled={mutation.isPending || uncertain || !!retrySeconds}
          onClick={() => setEditing(!editing)}
        >
          {t(editing ? 'cancel' : 'revise')}
        </button>
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
