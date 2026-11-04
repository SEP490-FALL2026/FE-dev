import { useState } from 'react'
import { FileText, Plus, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { EmployeeButton, EmployeeField, EmployeeInput, EmployeeSection } from '../../shared/components/employee-api-ui'
import { uuidPattern, isEmployeeResourceId } from '../../shared/employee-identifiers'
import type { EmployeeTabKey } from '../../enums'
import { EmployeeSubmittedRequests } from '../components/employee-submitted-requests'
import { EmployeeDraftRequests } from '../components/employee-draft-requests'

export function EmployeeLiveRequestsView({
  onSelectTab
}: {
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t: translate } = useTranslation('employee')
  const [lookup, setLookup] = useState('')
  const open = (id: string) => onSelectTab('request-detail', { id })
  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('myRequests')}
        icon={FileText}
        actions={
          <EmployeeButton primary onClick={() => onSelectTab('create-request')}>
            <Plus aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('create')}
          </EmployeeButton>
        }
      />
      <EmployeeSection title={translate('lookup')}>
        <p className='max-w-3xl text-sm text-muted-foreground'>{translate('lookupHint')}</p>
        <form
          className='flex max-w-3xl flex-wrap items-start gap-3'
          onSubmit={(event) => {
            event.preventDefault()
            const id = lookup.trim()
            if (isEmployeeResourceId(id)) open(id)
          }}
        >
          <div className='min-w-0 flex-1 basis-64'>
            <EmployeeField label={translate('requestCode')}>
              <EmployeeInput
                required
                pattern={uuidPattern}
                value={lookup}
                onChange={(event) => setLookup(event.target.value)}
              />
            </EmployeeField>
          </div>
          <div className='sm:pt-7'>
            <EmployeeButton type='submit'>
              <Search aria-hidden strokeWidth={1.5} className='size-4' />
              {translate('open')}
            </EmployeeButton>
          </div>
        </form>
      </EmployeeSection>
      <EmployeeSubmittedRequests onOpen={open} />
      <EmployeeDraftRequests onSelectTab={onSelectTab} />
    </div>
  )
}
