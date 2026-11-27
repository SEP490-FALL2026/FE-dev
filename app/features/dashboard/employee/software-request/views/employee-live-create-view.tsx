import { useState } from 'react'
import { createPortal } from 'react-dom'
import { FilePlus2, Repeat, Undo2, UserRound, UsersRound, Lightbulb } from 'lucide-react'
import { EmployeeSegmented } from '../../shared/components/employee-layout'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { EmployeeRequestGuide } from '../components/employee-request-guide'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useSearchParams } from 'react-router'
import { EmployeeButton } from '../../shared/components/employee-api-ui'
import type { RequestMode } from '../hooks/use-live-request-form'
import { LiveCreateForm } from '../components/live-create-form'
import type { EmployeeTabKey } from '../../enums'
import { isEmployeeResourceId } from '../../shared/employee-identifiers'
import { SoftwareProposalForm } from '~/entities/request/components/software-proposal-form'
import { Dialog } from '../../../dashboard-ui'

const REQUEST_MODES = ['individual', 'group', 'proposal', 'renewal', 'return'] as const
const modeIcons = { individual: UserRound, group: UsersRound, proposal: Lightbulb, renewal: Repeat, return: Undo2 }

export function EmployeeLiveCreateView({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [nextMode, setNextMode] = useState<{ mode: RequestMode; planId?: string } | null>(null)
  const value = searchParams.get('mode')
  const mode: RequestMode =
    value === 'group' || value === 'proposal' || value === 'renewal' || value === 'return' ? value : 'individual'
  const changeMode = (next: { mode: RequestMode; planId?: string }) => {
    setDirty(false)
    setNextMode(null)
    setSearchParams({ tab: 'create-request', mode: next.mode, ...(next.planId ? { planId: next.planId } : {}) })
  }
  const requestMode = (next: { mode: RequestMode; planId?: string }) => {
    if (busy || (next.mode === mode && !next.planId)) return
    if (dirty) setNextMode(next)
    else changeMode(next)
  }
  if (value === 'service') {
    const next = new URLSearchParams(searchParams)
    next.set('mode', 'individual')
    return <Navigate replace to={{ pathname: location.pathname, search: next.toString() }} />
  }
  return (
    <div className='space-y-6'>
      <EmployeePageHeader title={translate('create')} icon={FilePlus2} />
      <EmployeeSegmented
        label={translate('mode')}
        value={mode}
        options={REQUEST_MODES.map((option) => ({ value: option, label: translate(option), icon: modeIcons[option] }))}
        disabled={busy}
        onChange={(option) => requestMode({ mode: option })}
      />
      <div
        onChangeCapture={() => setDirty(true)}
        className='grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_300px]'
      >
        {mode === 'proposal' ? (
          <SoftwareProposalForm
            onCreated={(id) => onSelectTab('request-detail', { id })}
            onUsePlan={(planId) => requestMode({ mode: 'individual', planId })}
            onBusyChange={setBusy}
          />
        ) : (
          <LiveCreateForm
            key={`${mode}:${searchParams.get('assignmentId') ?? ''}:${searchParams.get('planId') ?? ''}`}
            mode={mode}
            assignmentId={searchParams.get('assignmentId') ?? ''}
            initialPlanId={
              isEmployeeResourceId(searchParams.get('planId') ?? '') ? (searchParams.get('planId') ?? '') : ''
            }
            onSelectTab={onSelectTab}
            onDirty={() => setDirty(true)}
            onBusyChange={setBusy}
          />
        )}
        <aside className='hidden min-w-0 2xl:block'>
          <EmployeeRequestGuide needsPreview={mode === 'individual' || mode === 'group'} group={mode === 'group'} />
        </aside>
      </div>
      {nextMode &&
        createPortal(
          <Dialog
            presentation='sheet'
            title={translate('unsaved.title')}
            hint={translate('unsaved.hint')}
            onClose={() => setNextMode(null)}
          >
            <div className='flex flex-wrap justify-end gap-3'>
              <EmployeeButton onClick={() => setNextMode(null)}>{translate('unsaved.keep')}</EmployeeButton>
              <EmployeeButton primary onClick={() => changeMode(nextMode)}>
                {translate('unsaved.discard')}
              </EmployeeButton>
            </div>
          </Dialog>,
          document.body
        )}
    </div>
  )
}
