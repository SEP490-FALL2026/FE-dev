import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TaxProfileResponseDtoDataStatus } from '../enums/tax-profile-status'

import { useVendorTaxProfileGet, useVendorTaxProfileHistory } from '~/shared/api/generated/operations/vendors'
import {
  FinanceButton,
  FinanceDrawer,
  FinancePagination,
  FinanceQueryState,
  FinanceStatus
} from '../../shared/components/finance-ui'
import { FinanceTable } from '../../shared/components/finance-table'
import { VendorTaxForm } from './vendor-tax-form'
import { VendorTaxEstimate } from './vendor-tax-estimate'

export function VendorTaxDetail({ id, name, onClose }: { id: string; name: string; onClose: () => void }) {
  const { t: translate } = useTranslation('financeSettings')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(false)
  const profile = useVendorTaxProfileGet(id)
  const history = useVendorTaxProfileHistory(id, { page, pageSize: 10 })
  const data = profile.data?.data
  const current = data?.profile ?? data?.defaultProfile
  return (
    <>
      {!editing && (
        <FinanceDrawer title={name} onClose={onClose}>
          <FinanceQueryState query={profile}>
            {data && (
              <>
                <div className='flex flex-wrap items-center gap-3'>
                  <FinanceStatus value={data.status} />
                  <FinanceButton
                    variant='primary'
                    disabled={!Object.values(TaxProfileResponseDtoDataStatus).some((value) => value === data.status)}
                    onClick={() => setEditing(true)}
                  >
                    {translate('declareProfile')}
                  </FinanceButton>
                </div>
                <h3 className='font-semibold'>
                  {translate(data.profile ? 'currentProfile' : 'defaultProfile')} ·{' '}
                  {current?.group
                    ? translate(`enum.${current.group}`, { defaultValue: translate('unavailable') })
                    : '—'}
                </h3>
                <FinanceTable
                  items={current?.lines ?? []}
                  rowKey={(line) => `${line.taxType}-${line.ratePercent}-${line.payer}`}
                  columns={[
                    { key: 'type', label: translate('taxType'), render: (line) => line.taxType },
                    { key: 'rate', label: translate('ratePercent'), numeric: true, render: (line) => line.ratePercent },
                    {
                      key: 'deductible',
                      label: translate('deductible'),
                      render: (line) => translate(line.deductible ? 'yes' : 'no')
                    },
                    {
                      key: 'payer',
                      label: translate('payer'),
                      render: (line) => translate(`enum.${line.payer}`, { defaultValue: translate('unavailable') })
                    }
                  ]}
                />
              </>
            )}
          </FinanceQueryState>
          <VendorTaxEstimate vendorId={id} />
          <h3 className='font-semibold'>{translate('history')}</h3>
          <FinanceQueryState query={history}>
            <div className='space-y-4'>
              {history.data?.data?.items.map((version) => (
                <section key={version.version} className='space-y-3 rounded-lg border border-border p-4'>
                  <p className='text-sm font-medium'>
                    {translate('version')} {version.version} ·{' '}
                    {translate(`enum.${version.group}`, { defaultValue: translate('unavailable') })}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {translate('declaredBy')}: {version.declaredBy} · {translate('declaredAt')}: {version.declaredAt}
                  </p>
                  <FinanceTable
                    items={version.lines}
                    rowKey={(line) => `${line.taxType}-${line.ratePercent}-${line.payer}`}
                    columns={[
                      { key: 'type', label: translate('taxType'), render: (line) => line.taxType },
                      {
                        key: 'rate',
                        label: translate('ratePercent'),
                        numeric: true,
                        render: (line) => line.ratePercent
                      },
                      {
                        key: 'deductible',
                        label: translate('deductible'),
                        render: (line) => translate(line.deductible ? 'yes' : 'no')
                      },
                      {
                        key: 'payer',
                        label: translate('payer'),
                        render: (line) => translate(`enum.${line.payer}`, { defaultValue: translate('unavailable') })
                      }
                    ]}
                  />
                </section>
              ))}
            </div>
            <FinancePagination pagination={history.data?.data?.pagination} onPageChange={setPage} />
          </FinanceQueryState>
        </FinanceDrawer>
      )}
      {editing && data && <VendorTaxForm vendorId={id} profile={data} onClose={() => setEditing(false)} />}
    </>
  )
}
