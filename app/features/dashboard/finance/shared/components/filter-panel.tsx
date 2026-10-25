import { Search } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { Panel, primaryButtonClassName, secondaryButtonClassName } from '../../../dashboard-ui'

/*
 * The compact "Bộ lọc" bar shared by Finance list screens: small labelled fields on one wrapping row, applied
 * together with "Áp dụng bộ lọc"; "Đặt lại" restores the defaults. Each screen keeps its own draft and applied state.
 */

const fieldClassName =
  'h-9 w-full rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground transition outline-none focus:border-primary focus:ring-3 focus:ring-primary-soft'

const searchClassName =
  'h-10 w-full rounded-lg border border-border bg-surface pr-3 pl-9 text-sm font-semibold text-foreground transition outline-none placeholder:font-normal placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary-soft'

export function FilterPanel({
  children,
  onApply,
  onReset,
  search
}: {
  children: React.ReactNode
  onApply: () => void
  onReset: () => void
  /** Optional full-width search bar shown above the smaller fields. */
  search?: React.ReactNode
}) {
  const { t } = useTranslation('dashboard')

  return (
    <Panel>
      <form
        aria-label={t('budgetPlan.filters.title')}
        className='space-y-3'
        onSubmit={(event) => {
          event.preventDefault()
          onApply()
        }}
      >
        {search}
        <div className='flex flex-wrap items-end gap-3'>
          {children}
          <div className='ml-auto flex gap-2'>
            <button className={primaryButtonClassName} type='submit'>
              {t('budgetPlan.filters.apply')}
            </button>
            <button className={secondaryButtonClassName} onClick={onReset} type='button'>
              {t('budgetPlan.filters.reset')}
            </button>
          </div>
        </div>
      </form>
    </Panel>
  )
}

function Field({ children, id, label }: { children: React.ReactNode; id: string; label: string }) {
  return (
    <div className='w-full space-y-1 sm:w-44'>
      <label className='block text-[0.7rem] font-semibold text-muted-foreground' htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  )
}

export function FilterSelectField({
  children,
  label,
  onChange,
  value
}: {
  children: React.ReactNode
  label: string
  onChange: (value: string) => void
  value: string
}) {
  const id = useId()
  return (
    <Field id={id} label={label}>
      <select className={fieldClassName} id={id} onChange={(event) => onChange(event.target.value)} value={value}>
        {children}
      </select>
    </Field>
  )
}

/** The long search bar on top of the filter panel; it applies with the other filters. */
export function FilterSearchField({
  label,
  onChange,
  placeholder,
  value
}: {
  label: string
  onChange: (value: string) => void
  placeholder: string
  value: string
}) {
  return (
    <div className='relative'>
      <Search
        aria-hidden='true'
        className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
      />
      <input
        aria-label={label}
        className={searchClassName}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type='search'
        value={value}
      />
    </div>
  )
}
