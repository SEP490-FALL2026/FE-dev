import { useState } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ApprovalsButton, approvalsInputClass } from './approvals-ui'

export function ApprovalsWorkspaceSearch() {
  const { t: translate } = useTranslation('approvalsSpend')
  const [requestId, setRequestId] = useState('')
  const [, setSearchParams] = useSearchParams()
  const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId.trim())
  return (
    <form
      className='ml-auto hidden w-full max-w-md items-center gap-2 sm:flex'
      onSubmit={(event) => {
        event.preventDefault()
        if (!valid) return
        setSearchParams({ tab: 'request', id: requestId.trim() })
        setRequestId('')
      }}
    >
      <label className='relative min-w-0 flex-1'>
        <span className='sr-only'>{translate('openId')}</span>
        <Search
          aria-hidden
          className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
          strokeWidth={1.5}
        />
        <input
          type='search'
          className={`${approvalsInputClass} pl-9`}
          placeholder={translate('idPlaceholder')}
          value={requestId}
          onChange={(event) => setRequestId(event.target.value)}
        />
      </label>
      <ApprovalsButton type='submit' disabled={!valid}>
        {translate('open')}
      </ApprovalsButton>
    </form>
  )
}
