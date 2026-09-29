import { useTranslation } from 'react-i18next'

import { detailTabs, type DetailTab } from '../employee-detail-demo'

export function EmployeeTabs({ selected, onChange }: { selected: DetailTab; onChange: (tab: DetailTab) => void }) {
  const { t } = useTranslation()
  return (
    <div className='overflow-x-auto border-b border-neutral-200'>
      <div
        role='tablist'
        aria-label={t('employeeDetail.tabs')}
        className='flex min-w-max gap-6'
        onKeyDown={(event) => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
          event.preventDefault()
          const index = detailTabs.indexOf(selected)
          const nextIndex =
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? detailTabs.length - 1
                : (index + (event.key === 'ArrowRight' ? 1 : -1) + detailTabs.length) % detailTabs.length
          onChange(detailTabs[nextIndex])
          event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus()
        }}
      >
        {detailTabs.map((tab) => (
          <button
            key={tab}
            id={`employee-tab-${tab}`}
            role='tab'
            type='button'
            aria-selected={selected === tab}
            aria-controls='employee-detail-panel'
            tabIndex={selected === tab ? 0 : -1}
            onClick={() => onChange(tab)}
            className={`min-h-12 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors ${selected === tab ? 'border-brand-500 text-brand-600' : 'border-transparent text-neutral-500 hover:border-neutral-200 hover:text-neutral-900'}`}
          >
            {t(`employeeDetail.${tab}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
