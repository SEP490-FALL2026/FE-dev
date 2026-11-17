import { FileText, Layers3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ContractResponseDtoDataContract } from '~/shared/api/generated/model/contracts'
import { useDashboardFormat } from '../../../dashboard-ui'
import { itButtonClass, itPrimaryClass } from '../../shared/components/it-form'

export function ContractDetailContent({
  contract,
  onOpenDocument,
  onUpload,
  uploadingDisabled
}: {
  contract: ContractResponseDtoDataContract
  onOpenDocument: (id: string) => void
  onUpload: () => void
  uploadingDisabled: boolean
}) {
  const { t } = useTranslation('itPurchases')
  const { t: catalog } = useTranslation('itCatalog')
  const { formatDate, formatDateTime } = useDashboardFormat()
  return (
    <div className='space-y-6'>
      <header className='space-y-4 border-b border-border pb-5'>
        <p className='text-xs font-semibold uppercase tracking-wider text-primary'>{t('contractOverview')}</p>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex min-w-0 flex-wrap items-center gap-3'>
            <h1 className='min-w-0 break-words text-2xl font-semibold tracking-tight'>{contract.name}</h1>
            <span className='rounded-md bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-ink'>
              {t(`contractStates.${contract.status}`, { defaultValue: t('unknown') })}
            </span>
          </div>
          <button type='button' className={itPrimaryClass} disabled={uploadingDisabled} onClick={onUpload}>
            {t('upload')}
          </button>
        </div>
      </header>
      <section className='rounded-lg border border-border bg-surface p-5'>
        <h2 className='text-base font-semibold'>{t('contractInformation')}</h2>
        <dl className='mt-4 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 xl:grid-cols-4'>
          <div>
            <dt className='text-muted-foreground'>{t('vendor')}</dt>
            <dd className='mt-1 font-medium'>{contract.vendor?.name ?? t('unknown')}</dd>
          </div>
          <div>
            <dt className='text-muted-foreground'>{t('contractNumber')}</dt>
            <dd className='mt-1 break-words font-medium'>{contract.number ?? t('unknown')}</dd>
          </div>
          <div>
            <dt className='text-muted-foreground'>{t('startDate')}</dt>
            <dd className='mt-1 font-medium'>
              {contract.effectiveFrom ? formatDate(contract.effectiveFrom) : t('unknown')}
            </dd>
          </div>
          <div>
            <dt className='text-muted-foreground'>{t('endDate')}</dt>
            <dd className='mt-1 font-medium'>
              {contract.effectiveTo ? formatDate(contract.effectiveTo) : t('noEndDate')}
            </dd>
          </div>
        </dl>
        {contract.note && (
          <p className='mt-4 whitespace-pre-wrap border-t border-border pt-4 text-sm text-muted-foreground'>
            {contract.note}
          </p>
        )}
        {contract.createdAt && (
          <p className='mt-4 text-xs text-muted-foreground'>
            {t('createdAt', { date: formatDateTime(contract.createdAt) })}
          </p>
        )}
      </section>
      <section className='space-y-3'>
        <div className='flex items-center gap-2 border-b border-border pb-3'>
          <Layers3 aria-hidden strokeWidth={1.5} className='size-5 text-primary' />
          <h2 className='text-lg font-semibold'>{t('subscriptions')}</h2>
        </div>
        {contract.subscriptions.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {contract.subscriptions.map((subscription) => (
              <article
                key={subscription.subscriptionId}
                className='flex flex-wrap items-center justify-between gap-3 p-4'
              >
                <div className='min-w-0'>
                  <h3 className='break-words font-semibold'>{subscription.applicationName}</h3>
                  <p className='mt-1 text-sm text-muted-foreground'>{subscription.planName}</p>
                </div>
                <span className='rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-medium'>
                  {catalog(`enums.${subscription.status}`, { defaultValue: t('unknown') })}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <p className='rounded-lg border border-border bg-surface p-5 text-sm text-muted-foreground'>
            {t('noSubscriptions')}
          </p>
        )}
        {contract.truncated?.subscriptions && (
          <p className='text-sm text-muted-foreground'>{t('subscriptionsTruncated')}</p>
        )}
      </section>
      <section className='space-y-3'>
        <header className='flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3'>
          <div className='flex items-center gap-2'>
            <FileText aria-hidden strokeWidth={1.5} className='size-5 text-primary' />
            <h2 className='text-lg font-semibold'>{t('documents')}</h2>
          </div>
        </header>
        {contract.documents.length ? (
          <div className='divide-y divide-border rounded-lg border border-border bg-surface'>
            {contract.documents.map((document) => (
              <article key={document.id} className='flex flex-wrap items-center justify-between gap-3 p-4'>
                <div className='min-w-0'>
                  <h3 className='break-all font-medium'>{document.fileName}</h3>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {t(`values.${document.purpose}`, { defaultValue: t('unknown') })}
                  </p>
                </div>
                <button type='button' className={itButtonClass} onClick={() => onOpenDocument(document.id)}>
                  {t('openDocument')}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className='rounded-lg border border-border bg-surface p-5 text-sm text-muted-foreground'>
            {t('noDocuments')}
          </p>
        )}
        {contract.truncated?.documents && <p className='text-sm text-muted-foreground'>{t('documentsTruncated')}</p>}
      </section>
    </div>
  )
}
