import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { toast } from 'sonner'
import { useContractCreate } from '~/shared/api/generated/operations/contracts/contract-create'
import { useVendorList } from '~/shared/api/generated/operations/vendors/vendor-list'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { ItQueryState, ItEmpty } from '../../shared/components/it-query-state'
import { ItPagination } from '../../shared/components/it-pagination'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { getItError } from '../../shared/hooks/it-errors'
export function ContractCreateDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const { t: translate } = useTranslation('itPurchases')
  const feedback = useItMutationFeedback([])
  const [uncertain, setUncertain] = useState(false)
  const [vendorId, setVendorId] = useState('')
  const [page, setPage] = useState(1)
  const vendors = useVendorList({ page, pageSize: 20 })
  const mutation = useContractCreate({
    mutation: {
      onError: async (error) => {
        setUncertain(getItError(error).key === 'unknownOutcome')
        await feedback.onError(error)
      },
      onSuccess: async (result) => {
        if (!result.data?.contract) {
          setUncertain(true)
          toast.error(translate('contractUncertain'), { id: 'it-admin-write' })
          return
        }
        await feedback.onSuccess()
        onCreated(result.data.contract.id)
        onClose()
      }
    }
  })
  return (
    <ItFormDialog
      title={translate('create')}
      onClose={onClose}
      pending={mutation.isPending}
      submitLabel={translate('create')}
      submitDisabled={uncertain || !vendorId}
      onSubmit={(event) => {
        event.preventDefault()
        const name = String(new FormData(event.currentTarget).get('name') ?? '').trim()
        const effectiveFrom = String(new FormData(event.currentTarget).get('effectiveFrom') ?? '')
        if (!mutation.isPending && !uncertain && vendorId && effectiveFrom)
          mutation.mutate({ data: { ...(name ? { name } : {}), vendorId, effectiveFrom } })
      }}
    >
      <ItField label={translate('name')} hint={translate('help.name')}>
        <input name='name' maxLength={200} placeholder={translate('namePlaceholder')} className={itInputClass} />
      </ItField>
      <fieldset className='space-y-2'>
        <legend>
          {translate('vendor')}{' '}
          <span className='text-danger' aria-hidden='true'>
            *
          </span>
        </legend>
        <p className='text-sm text-muted-foreground'>{translate('vendorHint')}</p>
        <ItQueryState query={vendors}>
          {vendors.data?.data?.items.length ? (
            vendors.data.data.items.map((vendor) => (
              <label key={vendor.id} className='flex min-h-11 items-center gap-3'>
                <input
                  type='radio'
                  name='vendor'
                  checked={vendorId === vendor.id}
                  onChange={() => setVendorId(vendor.id)}
                />
                {vendor.name}
              </label>
            ))
          ) : (
            <ItEmpty />
          )}
        </ItQueryState>
        <ItPagination
          page={page}
          pageSize={20}
          total={vendors.data?.data?.pagination.totalItems ?? 0}
          onChange={setPage}
        />
      </fieldset>
      <ItField label={translate('startDate')} hint={translate('startDateHint')}>
        <input name='effectiveFrom' type='date' required className={itInputClass} />
      </ItField>
      {uncertain && (
        <p role='status' className='text-sm text-danger-ink'>
          {translate('contractUncertain')}
        </p>
      )}
    </ItFormDialog>
  )
}
