import { Percent } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOperatingParameterList } from '~/shared/api/generated/operations/operating-parameters'
import {
  FinanceButton,
  FinanceEmpty,
  FinancePage,
  FinanceQueryState,
  FinanceSection
} from '../../shared/components/finance-ui'
import { parameterText, pickBudgetParameters, type BudgetParameter } from '../budget-parameters'
import { ParameterEditDialog } from '../components/parameter-edit-dialog'

function ParameterCard({ parameter, onEdit }: { parameter: BudgetParameter; onEdit: () => void }) {
  const { t: translate } = useTranslation('financeReview')
  const label = parameterText(translate, parameter, 'label')
  return (
    <article className='flex flex-col gap-4 rounded-xl border border-border/70 bg-surface p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.05)]'>
      <header className='flex items-start gap-3'>
        <span className='kpi-chip grid size-10 shrink-0 place-items-center rounded-lg'>
          <Percent aria-hidden className='size-5' strokeWidth={1.5} />
        </span>
        <div className='min-w-0 space-y-1'>
          <h3 className='text-sm leading-snug font-semibold text-foreground [text-wrap:balance]'>{label}</h3>
          <p className='text-xs leading-relaxed text-muted-foreground [text-wrap:pretty]'>
            {parameterText(translate, parameter, 'description')}
          </p>
        </div>
      </header>
      <div className='soft-panel mt-auto flex items-end justify-between gap-3 px-4 py-3'>
        <div className='space-y-0.5'>
          <p className='text-[11px] font-semibold tracking-wider text-muted-foreground uppercase'>
            {translate('ui.currentValue')}
          </p>
          <p className='font-mono text-2xl leading-none font-semibold tracking-tight text-primary-ink tabular-nums'>
            {String(parameter.value)}
            <span className='ml-1 text-sm font-medium text-muted-foreground'>{parameter.unitLabel}</span>
          </p>
        </div>
        <div className='text-right text-xs text-muted-foreground'>
          <p className='font-mono tabular-nums'>
            {translate('ui.defaultValue', { value: `${String(parameter.default)} ${parameter.unitLabel}` })}
          </p>
          <p className='font-mono tabular-nums'>
            {parameter.changedAt
              ? translate('ui.changedOn', { date: parameter.changedAt.slice(0, 10) })
              : translate('ui.neverChanged')}
          </p>
        </div>
      </div>
      <FinanceButton className='w-full' aria-label={translate('parameters.editTitle', { label })} onClick={onEdit}>
        {translate('parameters.edit')}
      </FinanceButton>
    </article>
  )
}

export function FinanceBudgetParametersView() {
  const { t: translate } = useTranslation('financeReview')
  const [editing, setEditing] = useState<string | null>(null)
  const query = useOperatingParameterList()
  const parameters = pickBudgetParameters(query.data?.data?.items)
  const selected = parameters.find((parameter) => parameter.key === editing)

  return (
    <FinancePage title={translate('parameters.title')} description={translate('parameters.description')}>
      <FinanceSection title={translate('ui.parametersList')}>
        <FinanceQueryState query={query} skeleton='kpis'>
          {parameters.length === 0 ? (
            <FinanceEmpty message={translate('parameters.empty')} />
          ) : (
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {parameters.map((parameter) => (
                <ParameterCard key={parameter.key} parameter={parameter} onEdit={() => setEditing(parameter.key)} />
              ))}
            </div>
          )}
        </FinanceQueryState>
      </FinanceSection>
      {selected && <ParameterEditDialog parameter={selected} onClose={() => setEditing(null)} />}
    </FinancePage>
  )
}
