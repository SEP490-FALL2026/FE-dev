import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ApplicationPageResponseDtoDataItemsItem } from '~/shared/api/generated/model/applications'
import { itButtonClass } from '../../shared/components/it-form'
import { CatalogApplicationLogo } from './catalog-application-logo'
import { CatalogApplicationPlans, useCatalogApplicationPlans } from './catalog-application-plans'
import type { SetupPlan } from './catalog-plan-setup'

export function CatalogApplicationCard({
  item,
  onEdit,
  onAddPlan,
  onSetup
}: {
  item: ApplicationPageResponseDtoDataItemsItem
  onEdit: () => void
  onAddPlan: () => void
  onSetup: (plan: SetupPlan) => void
}) {
  const { t } = useTranslation('itCatalog')
  const plans = useCatalogApplicationPlans(item.id)
  return (
    <article className='space-y-4 rounded-lg border border-border bg-surface p-5'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex min-w-0 items-start gap-3'>
          <CatalogApplicationLogo key={item.logoUrl ?? ''} name={item.name} url={item.logoUrl} />
          <div className='min-w-0 space-y-1'>
            <h2 className='truncate text-base font-semibold' title={item.name}>
              {item.name}
            </h2>
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm'>
              <span className='text-muted-foreground'>{t(`enums.${item.kind}`, { defaultValue: t('unknown') })}</span>
              <span className='rounded-md bg-surface-subtle px-2 py-1 text-xs font-medium'>
                {t(`applicationStatus.${item.status}`, { defaultValue: t('unknown') })}
              </span>
            </div>
            <p className='text-sm text-muted-foreground'>
              {t('responsibleItAdmin')}:{' '}
              <span className='text-foreground'>{item.responsibleItAdmin?.fullName ?? t('noResponsible')}</span>
            </p>
          </div>
        </div>
        <div className='flex flex-wrap items-start gap-2'>
          {item.status === 'APPROVED' && (
            <>
              <button type='button' className={itButtonClass} onClick={onEdit}>
                {t('edit')}
              </button>
              <button type='button' className={itButtonClass} onClick={onAddPlan}>
                {t('addPlan')}
              </button>
            </>
          )}
          {plans.data && plans.data.length > 0 && (
            <details className='relative'>
              <summary className={`${itButtonClass} list-none cursor-pointer [&::-webkit-details-marker]:hidden`}>
                {t('setup.action')} <ChevronDown aria-hidden strokeWidth={1.5} className='size-4' />
              </summary>
              <div className='absolute right-0 z-20 mt-2 grid max-h-64 min-w-56 gap-1 overflow-y-auto rounded-md border border-border bg-surface p-2 shadow-lg'>
                {plans.data.map((plan) => (
                  <button
                    key={plan.id}
                    type='button'
                    className='min-h-11 rounded-md px-3 py-2 text-left text-sm hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-primary'
                    onClick={() => onSetup(plan)}
                  >
                    {t('setup.openPlan', { name: plan.name })}
                  </button>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
      <CatalogApplicationPlans query={plans} />
    </article>
  )
}
