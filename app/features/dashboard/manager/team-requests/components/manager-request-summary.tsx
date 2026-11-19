import { useTranslation } from 'react-i18next'
import type { ManagerChoice } from '../../shared/components/manager-choice-select'

export function ManagerRequestSummary({ plan, people }: { plan: ManagerChoice; people: readonly ManagerChoice[] }) {
  const { t: translate } = useTranslation('manager')
  return (
    <dl className='space-y-4 border-b border-border/60 pb-4 text-sm'>
      <div>
        <dt className='text-muted-foreground'>{translate('plan')}</dt>
        <dd className='mt-1 font-medium'>{plan.label}</dd>
        {plan.description && <dd className='text-muted-foreground'>{plan.description}</dd>}
      </div>
      <div>
        <dt className='text-muted-foreground'>{translate('beneficiaries')}</dt>
        <dd>
          <ul className='mt-2 space-y-2'>
            {people.map((person) => (
              <li key={person.value} className='break-words'>
                <span className='font-medium'>{person.label}</span>
                {person.description && <span className='ml-2 text-muted-foreground'>{person.description}</span>}
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  )
}
