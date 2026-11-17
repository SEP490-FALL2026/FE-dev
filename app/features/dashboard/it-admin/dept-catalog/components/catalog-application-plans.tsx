import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getPlanListQueryKey, planList } from '~/shared/api/generated/operations/plans/plan-list'
import { itButtonClass } from '../../shared/components/it-form'

export function useCatalogApplicationPlans(applicationId: string) {
  const params = { applicationId, pageSize: 100 }
  return useQuery({
    queryKey: [...getPlanListQueryKey(params), 'all-pages'],
    queryFn: async () => {
      const items = []
      let page = 1
      let totalPages = 1
      while (page <= totalPages) {
        const response = await planList({ ...params, page })
        if (!response.data) throw new Error('Missing plan page')
        items.push(...response.data.items)
        totalPages = response.data.pagination.totalPages ?? 1
        page++
      }
      return items
    }
  })
}

export function CatalogApplicationPlans({ query }: { query: ReturnType<typeof useCatalogApplicationPlans> }) {
  const { t } = useTranslation('itCatalog')
  return (
    <div className='border-t border-border/70 pt-4 text-sm'>
      <h3 className='font-medium text-foreground'>{t('applicationProvision')}</h3>
      {query.isPending ? (
        <p className='text-muted-foreground'>{t('planMethodsLoading')}</p>
      ) : query.isError ? (
        <div className='flex flex-wrap items-center gap-2'>
          <p className='text-muted-foreground'>{t('planMethodsError')}</p>
          <button type='button' className={itButtonClass} onClick={() => void query.refetch()}>
            {t('planMethodsRetry')}
          </button>
        </div>
      ) : query.data.length ? (
        <ul className='mt-2 flex flex-wrap gap-2 text-muted-foreground'>
          {query.data.map((plan) => (
            <li key={plan.id} className='rounded-md bg-surface-subtle px-3 py-2'>
              <span>
                {plan.name} · {t(`applicationProvisionValues.${plan.provisioningType}`, { defaultValue: t('unknown') })}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-muted-foreground'>{t('planMethodsEmpty')}</p>
      )}
    </div>
  )
}
