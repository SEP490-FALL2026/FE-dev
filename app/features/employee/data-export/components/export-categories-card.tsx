import { useTranslation } from 'react-i18next'

import type { ExportCategoryId, ExportCategoryItem } from '../data-export.types'

interface ExportCategoriesCardProps {
  categories: ExportCategoryItem[]
  selectedCategories: Record<ExportCategoryId, boolean>
  onToggleCategory: (id: ExportCategoryId) => void
  onToggleAll: () => void
}

export function ExportCategoriesCard({
  categories,
  selectedCategories,
  onToggleCategory,
  onToggleAll
}: ExportCategoriesCardProps) {
  const { t } = useTranslation()

  const allSelected = categories.every((cat) => selectedCategories[cat.id])

  return (
    <div className='rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs'>
      <div className='mb-4 flex items-center justify-between border-b border-neutral-200 pb-4'>
        <div className='flex items-center gap-2.5'>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white shadow-xs'>
            {1}
          </div>
          <h2 className='text-sm font-bold text-neutral-900'>{t('dataExport.step1.title')}</h2>
        </div>
        <button
          className='text-xs font-medium text-brand-500 transition-colors hover:text-brand-600'
          onClick={onToggleAll}
          type='button'
        >
          {allSelected
            ? t('dataExport.step1.deselectAll')
            : t('dataExport.step1.selectAll', { count: categories.length })}
        </button>
      </div>

      <div className='space-y-3'>
        {categories.map((cat) => {
          const isChecked = !!selectedCategories[cat.id]

          return (
            <label
              className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                isChecked
                  ? 'border-brand-300 bg-[#FEFBF7] hover:bg-white'
                  : 'border-neutral-200 bg-white hover:bg-[#FEFBF7]'
              }`}
              key={cat.id}
            >
              <input
                checked={isChecked}
                className='mt-1 h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500'
                onChange={() => onToggleCategory(cat.id)}
                type='checkbox'
              />
              <div className='flex-1'>
                <div className='flex items-center justify-between'>
                  <div className='text-xs font-bold text-neutral-900 transition-colors group-hover:text-brand-500'>
                    {t(cat.titleKey)}
                  </div>
                  <span className='rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600'>
                    {t(cat.sizeKey)}
                  </span>
                </div>
                <p className='mt-0.5 text-[11px] leading-relaxed text-neutral-500'>{t(cat.descriptionKey)}</p>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
