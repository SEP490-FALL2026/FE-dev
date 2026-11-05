import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilePenLine } from 'lucide-react'
import { TaxProfileResponseDtoDataStatus } from '../enums/tax-profile-status'

import { useVendorTaxProfileGet, useVendorTaxProfileHistory } from '~/shared/api/generated/operations/vendors'
import {
  FinanceButton,
  FinanceDrawer,
  FinancePagination,
  FinanceQueryState,
  FinanceSection,
  FinanceStat,
  FinanceStatGrid,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { VendorTaxForm } from './vendor-tax-form'
import { VendorTaxEstimate } from './vendor-tax-estimate'
import { taxLineKey, useTaxLineColumns } from './tax-line-columns'

export function VendorTaxDetail({ id, name, onClose }: { id: string; name: string; onClose: () => void }) {
  const { t: translate } = useTranslation('financeSettings')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(false)
  const profile = useVendorTaxProfileGet(id)
  const history = useVendorTaxProfileHistory(id, { page, pageSize: 10 })
  const columns = useTaxLineColumns()
  const data = profile.data?.data
  const current = data?.profile ?? data?.defaultProfile
  const groupLabel = (group?: string) =>
    group ? translate(`enum.${group}`, { defaultValue: translate('unavailable') }) : '—'
  return (
    <FinanceDrawer title={name} onClose={onClose}>
      <FinanceQueryState query={profile}>
        {data && (
          <div className='space-y-6'>
            <FinanceSection
              title={translate('overview')}
              actions={
                <FinanceButton
                  variant='primary'
                  disabled={!Object.values(TaxProfileResponseDtoDataStatus).some((value) => value === data.status)}
                  onClick={() => setEditing(true)}
                >
                  <FilePenLine aria-hidden className='size-4' strokeWidth={1.5} />
                  {translate('declareProfile')}
                </FinanceButton>
              }
            >
              <FinanceStatGrid>
                <FinanceStat label={translate('taxProfile')} value={<FinanceStatus value={data.status} />} />
                <FinanceStat label={translate('taxGroup')} value={groupLabel(current?.group)} />
                <FinanceStat
                  label={translate('profileSource')}
                  value={
                    <span className='font-sans text-base'>
                      {translate(data.profile ? 'currentProfile' : 'defaultProfile')}
                    </span>
                  }
                />
              </FinanceStatGrid>
            </FinanceSection>
            <FinanceSection title={translate('taxLines')}>
              <FinanceTable items={current?.lines ?? []} rowKey={taxLineKey} columns={columns} />
            </FinanceSection>
          </div>
        )}
      </FinanceQueryState>
      <div className='border-t border-border/60 pt-5'>
        <VendorTaxEstimate vendorId={id} />
      </div>
      <div className='border-t border-border/60 pt-5'>
        <FinanceSection title={translate('history')}>
          <FinanceQueryState query={history}>
            <div className='space-y-3'>
              {history.data?.data?.items.map((version) => (
                <article key={version.version} className='space-y-3 rounded-lg border border-border/70 bg-surface p-4'>
                  <header className='space-y-0.5'>
                    <p className='text-sm font-medium'>
                      {translate('version')} <span className='tabular-nums'>{version.version}</span> ·{' '}
                      {groupLabel(version.group)}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {translate('declaredBy')}: {version.declaredBy} · {translate('declaredAt')}:{' '}
                      <span className='tabular-nums'>{version.declaredAt}</span>
                    </p>
                  </header>
                  <FinanceTable items={version.lines} rowKey={taxLineKey} columns={columns} />
                </article>
              ))}
            </div>
            <FinancePagination pagination={history.data?.data?.pagination} onPageChange={setPage} />
          </FinanceQueryState>
        </FinanceSection>
      </div>
      {editing && data && <VendorTaxForm vendorId={id} profile={data} onClose={() => setEditing(false)} />}
    </FinanceDrawer>
  )
}
