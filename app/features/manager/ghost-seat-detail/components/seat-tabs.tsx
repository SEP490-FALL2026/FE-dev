import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ghostDetailTabs, type GhostDetailTab } from '../ghost-seat-detail-demo'

export function SeatTabs({
  selected,
  onChange
}: {
  selected: GhostDetailTab
  onChange: (tab: GhostDetailTab) => void
}) {
  const { t } = useTranslation()
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  return (
    <div
      role='tablist'
      aria-label={t('ghostDetail.detailTabs')}
      className='flex gap-6 overflow-x-auto border-b border-neutral-200'
    >
      {ghostDetailTabs.map((tab, index) => (
        <button
          key={tab}
          type='button'
          role='tab'
          id={`ghost-tab-${tab}`}
          aria-controls='ghost-detail-panel'
          aria-selected={selected === tab}
          tabIndex={selected === tab ? 0 : -1}
          ref={(node) => {
            refs.current[index] = node
          }}
          onClick={() => onChange(tab)}
          onKeyDown={(e) => {
            const next =
              e.key === 'ArrowRight'
                ? (index + 1) % ghostDetailTabs.length
                : e.key === 'ArrowLeft'
                  ? (index + ghostDetailTabs.length - 1) % ghostDetailTabs.length
                  : e.key === 'Home'
                    ? 0
                    : e.key === 'End'
                      ? ghostDetailTabs.length - 1
                      : null
            if (next === null) return
            e.preventDefault()
            onChange(ghostDetailTabs[next])
            refs.current[next]?.focus()
          }}
          className={`shrink-0 border-b-2 pb-3 text-xs font-medium ${selected === tab ? 'border-brand-500 font-bold text-brand-600' : 'border-transparent text-neutral-500 hover:text-brand-600'}`}
        >
          {t(`ghostDetail.tabs.${tab}`)}
        </button>
      ))}
    </div>
  )
}
