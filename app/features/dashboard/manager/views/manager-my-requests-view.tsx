import { CalendarDays, ChevronDown, ClipboardList, FolderOpen, Plus, Search, UserRound, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ManagerIdentityMark } from '../manager-identity-mark'
import type { ManagerTabKey } from '../manager-nav'
import type { ManagerPreviewRequest } from '../manager-preview-request'
import { ManagerSummaryStrip } from '../manager-summary-strip'

interface ManagerMyRequestsViewProps {
  managerName: string
  onSelectTab: (tab: ManagerTabKey, params?: Record<string, string>) => void
  requests: readonly ManagerPreviewRequest[]
}

export function ManagerMyRequestsView({ managerName, onSelectTab, requests }: ManagerMyRequestsViewProps) {
  const { i18n, t } = useTranslation('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [scopeFilter, setScopeFilter] = useState<'all' | 'team' | 'individual'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN'
  const formatCount = (value: number) => new Intl.NumberFormat(locale).format(value)
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(`${value}T00:00:00Z`)
    )
  const formatCreatedAt = (value: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase(locale)
  const filteredRequests = requests.filter(
    (request) =>
      (scopeFilter === 'all' || request.scope === scopeFilter) &&
      (normalizedSearch.length === 0 ||
        [request.softwareName, request.desiredPlan, ...request.recipientNames].some((value) =>
          value.toLocaleLowerCase(locale).includes(normalizedSearch)
        ))
  )
  const teamCount = requests.filter((request) => request.scope === 'team').length

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='space-y-2'>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <FolderOpen aria-hidden='true' className='size-3.5' />
            {t('manager.myRequests.sessionBadge')}
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('manager.myRequests.title')}
          </h1>
          <p className='max-w-2xl text-sm text-muted-foreground'>
            {t('manager.myRequests.subtitle', { name: managerName })}
          </p>
        </div>
        <button
          className='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          onClick={() => onSelectTab('create-employee-request', { scope: 'individual' })}
          type='button'
        >
          <Plus aria-hidden='true' className='size-4' />
          {t('manager.myRequests.createButton')}
        </button>
      </div>

      <ManagerSummaryStrip
        metrics={[
          { label: t('manager.myRequests.totalMetric'), value: formatCount(requests.length) },
          { label: t('manager.myRequests.teamMetric'), value: formatCount(teamCount) },
          { label: t('manager.myRequests.individualMetric'), value: formatCount(requests.length - teamCount) }
        ]}
      />

      {requests.length === 0 ? (
        <div className='rounded-2xl border border-border bg-surface px-6 py-14 text-center shadow-sm'>
          <div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary'>
            <ClipboardList aria-hidden='true' className='size-7' />
          </div>
          <h2 className='mt-5 text-lg font-bold text-foreground'>{t('manager.myRequests.emptyTitle')}</h2>
          <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground'>
            {t('manager.myRequests.emptyDescription')}
          </p>
          <div className='mt-6 flex flex-wrap justify-center gap-2'>
            <button
              className='min-h-11 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90'
              onClick={() => onSelectTab('create-employee-request', { scope: 'team' })}
              type='button'
            >
              {t('manager.nav.requestForTeam')}
            </button>
            <button
              className='min-h-11 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-subtle'
              onClick={() => onSelectTab('create-employee-request', { scope: 'individual' })}
              type='button'
            >
              {t('manager.nav.requestForIndividual')}
            </button>
          </div>
        </div>
      ) : (
        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6'>
          <div className='flex flex-col gap-3 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between'>
            <label className='relative block w-full lg:max-w-sm'>
              <Search
                aria-hidden='true'
                className='absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
              />
              <span className='sr-only'>{t('manager.myRequests.searchLabel')}</span>
              <input
                className='min-h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('manager.myRequests.searchPlaceholder')}
                type='search'
                value={searchTerm}
              />
            </label>
            <div aria-label={t('manager.myRequests.filterLabel')} className='flex flex-wrap gap-2' role='group'>
              {(['all', 'team', 'individual'] as const).map((scope) => (
                <button
                  aria-pressed={scopeFilter === scope}
                  className={`min-h-10 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                    scopeFilter === scope
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                  }`}
                  key={scope}
                  onClick={() => setScopeFilter(scope)}
                  type='button'
                >
                  {t(`manager.myRequests.filter.${scope}`)}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <p className='py-14 text-center text-sm text-muted-foreground'>{t('manager.myRequests.noMatches')}</p>
          ) : (
            <div className='divide-y divide-border'>
              {filteredRequests.map((request) => (
                <article className='py-5 first:pt-5 last:pb-0' key={request.id}>
                  <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                    <div className='flex min-w-0 gap-3'>
                      <ManagerIdentityMark className='size-11' name={request.softwareName} />
                      <div className='min-w-0 space-y-1.5'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <h2 className='text-base font-bold text-foreground'>{request.softwareName}</h2>
                          <span className='rounded-full border border-primary/20 bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary'>
                            {t('manager.myRequests.previewStatus')}
                          </span>
                        </div>
                        <p className='text-sm text-muted-foreground'>{request.desiredPlan}</p>
                        <p className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
                          <span className='inline-flex items-center gap-1.5'>
                            {request.scope === 'team' ? (
                              <UsersRound aria-hidden='true' className='size-3.5' />
                            ) : (
                              <UserRound aria-hidden='true' className='size-3.5' />
                            )}
                            {t(`manager.myRequests.filter.${request.scope}`)} · {request.recipientNames.length}
                          </span>
                          <span className='inline-flex items-center gap-1.5'>
                            <CalendarDays aria-hidden='true' className='size-3.5' />
                            {formatDate(request.usageStartDate)} – {formatDate(request.usageEndDate)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <time className='shrink-0 text-xs text-muted-foreground' dateTime={request.createdAt}>
                      {formatCreatedAt(request.createdAt)}
                    </time>
                  </div>
                  <div className='mt-4 rounded-xl border border-border bg-background px-4 py-3'>
                    <button
                      aria-controls={`manager-preview-details-${request.id}`}
                      aria-expanded={expandedId === request.id}
                      className='flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      onClick={() => setExpandedId((current) => (current === request.id ? null : request.id))}
                      type='button'
                    >
                      {t('manager.myRequests.viewDetails')}
                      <ChevronDown
                        aria-hidden='true'
                        className={`size-4 transition-transform ${expandedId === request.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedId === request.id && (
                      <dl
                        className='mt-4 grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-2'
                        id={`manager-preview-details-${request.id}`}
                      >
                        <div>
                          <dt className='text-xs text-muted-foreground'>{t('manager.myRequests.recipientsLabel')}</dt>
                          <dd className='mt-1 font-medium text-foreground'>{request.recipientNames.join(', ')}</dd>
                        </div>
                        <div>
                          <dt className='text-xs text-muted-foreground'>{t('manager.createRequest.labelUrgency')}</dt>
                          <dd className='mt-1 font-medium text-foreground'>
                            {t(
                              request.urgency === 'HIGH'
                                ? 'manager.requests.urgencyHigh'
                                : request.urgency === 'MEDIUM'
                                  ? 'manager.requests.urgencyMedium'
                                  : 'manager.requests.urgencyLow'
                            )}
                          </dd>
                        </div>
                        <div className='sm:col-span-2'>
                          <dt className='text-xs text-muted-foreground'>
                            {t('manager.createRequest.labelJustification')}
                          </dt>
                          <dd className='mt-1 whitespace-pre-wrap text-foreground'>{request.justification}</dd>
                        </div>
                      </dl>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
