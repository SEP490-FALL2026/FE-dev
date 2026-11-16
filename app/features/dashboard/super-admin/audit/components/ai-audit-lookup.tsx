import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAiInvocationContentGet } from '~/shared/api/generated/operations/ai-assist/ai-invocation-content-get'
import { AdminField, adminButtonClass, adminInputClass } from '../../shared/components/admin-form'
import { AdminQueryState } from '../../shared/components/admin-query-state'
import { AuditValues } from './audit-values'

export function AiAuditLookup() {
  const { t: translate } = useTranslation('admin')
  const [reference, setReference] = useState('')
  const [selected, setSelected] = useState('')
  if (selected) return <AiAuditContent key={selected} reference={selected} onClose={() => setSelected('')} />
  return (
    <section className='space-y-3 rounded-lg border border-border bg-surface p-5'>
      <h2 className='font-semibold'>{translate('auditView.aiTitle')}</h2>
      <form
        className='grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end'
        onSubmit={(event) => {
          event.preventDefault()
          if (event.currentTarget.checkValidity()) setSelected(reference.trim())
        }}
      >
        <AdminField label={translate('auditView.aiReference')} description={translate('auditView.aiHelp')}>
          <input
            required
            className={adminInputClass}
            value={reference}
            pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
            onChange={(event) => setReference(event.target.value)}
          />
        </AdminField>
        <button type='submit' className={adminButtonClass}>
          {translate('auditView.read')}
        </button>
      </form>
    </section>
  )
}

function AiAuditContent({ reference, onClose }: { reference: string; onClose: () => void }) {
  const { t: translate } = useTranslation('admin')
  const query = useAiInvocationContentGet(reference, {
    query: { retry: false, staleTime: 0, refetchOnWindowFocus: false, refetchOnReconnect: false }
  })
  const content = query.data?.data
  return (
    <section className='space-y-5'>
      <button className={adminButtonClass} type='button' onClick={onClose}>
        {translate('auditView.aiBack')}
      </button>
      <h1 className='text-2xl font-semibold'>{translate('auditView.aiTitle')}</h1>
      <AdminQueryState query={query}>
        {content && (
          <div className='grid gap-4'>
            {(['promptText', 'rawResponse', 'context', 'parsed', 'result'] as const).map((field) => (
              <section key={field} className='space-y-3 rounded-lg border border-border bg-surface p-5'>
                <h2 className='font-semibold'>
                  {translate(
                    `auditView.${field === 'promptText' ? 'prompt' : field === 'rawResponse' ? 'response' : field}`
                  )}
                </h2>
                <AuditValues value={content[field]} />
              </section>
            ))}
          </div>
        )}
      </AdminQueryState>
    </section>
  )
}
