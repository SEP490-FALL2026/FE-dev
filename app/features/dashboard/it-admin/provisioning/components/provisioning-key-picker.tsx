import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLicenseKeyList } from '~/shared/api/generated/operations/license-keys/license-key-list'
import { LicenseKeyListStatus } from '~/shared/api/generated/model/license-keys/licenseKeyListStatus'
import { LicenseKeyListWithdrawn } from '~/shared/api/generated/model/license-keys/licenseKeyListWithdrawn'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { ItPagination } from '../../shared/components/it-pagination'
import { ItQueryState } from '../../shared/components/it-query-state'
import { itButtonClass } from '../../shared/components/it-form'

export function ProvisioningKeyPicker({
  subscriptionId,
  value,
  onChange,
  onValidityChange
}: {
  subscriptionId: string | null
  value: string
  onChange: (id: string) => void
  onValidityChange: (valid: boolean) => void
}) {
  const { t } = useTranslation('itProvisioning')
  const [page, setPage] = useState(1)
  const query = useLicenseKeyList(
    {
      subscriptionId: subscriptionId ?? '',
      status: LicenseKeyListStatus.IN_STORE,
      withdrawn: LicenseKeyListWithdrawn.false,
      page,
      pageSize: 20
    },
    { query: { enabled: !!subscriptionId } }
  )
  const data = !query.isError ? query.data?.data : undefined
  const keys =
    data?.items.filter(
      (key) => key.subscriptionId === subscriptionId && key.status === LicenseKeyListStatus.IN_STORE && !key.withdrawnAt
    ) ?? []
  const valid = !!subscriptionId && !query.isFetching && !query.isError && keys.some((key) => key.id === value)
  useEffect(() => onValidityChange(valid), [valid, onValidityChange])
  if (!subscriptionId)
    return (
      <p role='status' className='text-sm text-warning'>
        {t('keySubscriptionMissing')}
      </p>
    )
  return (
    <div className='space-y-3'>
      <ItQueryState query={query}>
        <ItChoiceSelect
          label={t('licenseKey')}
          hint={t('licenseKeyHint')}
          value={value}
          disabled={query.isFetching}
          options={keys.map((key) => ({ value: key.id, label: key.masked }))}
          onChange={onChange}
        />
        {!keys.length && (
          <p role='status' className='text-sm text-muted-foreground'>
            {t('noFreeKeys')}
          </p>
        )}
        {data && (
          <ItPagination
            page={page}
            pageSize={20}
            total={data.pagination.totalItems}
            disabled={query.isFetching}
            onChange={(next) => {
              onChange('')
              setPage(next)
            }}
          />
        )}
      </ItQueryState>
      <button type='button' className={itButtonClass} disabled={query.isFetching} onClick={() => void query.refetch()}>
        {t('reloadKeys')}
      </button>
    </div>
  )
}
