import { AlertTriangle, Boxes, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MOCK_TEAM_SOFTWARE } from '../manager-data'
import type { ManagerTabKey } from '../manager-nav'

interface ManagerTeamSoftwareViewProps {
  formatCurrency: (value: number) => string
  onSelectTab?: (tab: ManagerTabKey, params?: Record<string, string>) => void
}

export function ManagerTeamSoftwareView({ formatCurrency, onSelectTab }: ManagerTeamSoftwareViewProps) {
  const { t } = useTranslation('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const filteredSoftware = MOCK_TEAM_SOFTWARE.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(MOCK_TEAM_SOFTWARE.map((s) => s.category)))

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            {t('manager.software.title')}
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('manager.software.subtitle')}</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-4'>
        {/* Search & Categories */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <input
              className='h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('manager.software.searchPlaceholder')}
              type='search'
              value={searchTerm}
            />
          </div>

          <div className='flex flex-wrap items-center gap-1.5'>
            <button
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === 'ALL'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              }`}
              onClick={() => setSelectedCategory('ALL')}
              type='button'
            >
              {t('manager.software.filterAll')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                }`}
                onClick={() => setSelectedCategory(cat)}
                type='button'
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Software Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground'>
                <th className='py-3 px-4 font-semibold'>{t('manager.software.colName')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.software.colCategory')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.software.colPlan')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.software.colSeats')}</th>
                <th className='py-3 px-4 font-semibold'>{t('manager.software.colActiveRate')}</th>
                <th className='py-3 px-4 text-center font-semibold'>{t('manager.software.colGhostSeats')}</th>
                <th className='py-3 px-4 text-right font-semibold'>{t('manager.software.colMonthlyCost')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {filteredSoftware.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-12 text-center text-muted-foreground'>
                    <Boxes className='mx-auto size-8 text-muted-foreground/40 mb-2' />
                    <p className='font-medium'>{t('manager.software.empty')}</p>
                  </td>
                </tr>
              ) : (
                filteredSoftware.map((item) => (
                  <tr key={item.id} className='transition hover:bg-surface-subtle/50'>
                    <td className='py-3.5 px-4'>
                      <div className='flex items-center gap-3'>
                        <span className='flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-base'>
                          {item.logo}
                        </span>
                        <div>
                          <p className='font-bold text-foreground'>{item.name}</p>
                          <p className='text-[11px] text-muted-foreground'>{item.vendor}</p>
                        </div>
                      </div>
                    </td>

                    <td className='py-3.5 px-4'>
                      <span className='rounded-md bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-foreground'>
                        {item.category}
                      </span>
                    </td>

                    <td className='py-3.5 px-4 font-medium text-muted-foreground'>{item.plan}</td>

                    <td className='py-3.5 px-4 text-center font-mono font-medium text-foreground'>
                      {item.inUseSeats} / {item.totalSeats}
                    </td>

                    <td className='py-3.5 px-4'>
                      <div className='w-32 space-y-1'>
                        <div className='flex justify-between text-[10px] font-mono'>
                          <span className='font-bold text-foreground'>{item.activeRate}%</span>
                        </div>
                        <div className='h-1.5 w-full overflow-hidden rounded-full bg-border'>
                          <div
                            className={`h-full rounded-full ${
                              item.activeRate >= 80 ? 'bg-success' : item.activeRate >= 50 ? 'bg-warning' : 'bg-danger'
                            }`}
                            style={{ width: `${item.activeRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className='py-3.5 px-4 text-center'>
                      {item.ghostCount > 0 ? (
                        <button
                          className='inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-[11px] font-bold text-danger transition hover:bg-danger/20'
                          onClick={() => onSelectTab?.('ghost-seat-review')}
                          type='button'
                        >
                          <AlertTriangle className='size-3' />
                          <span>{item.ghostCount}</span>
                        </button>
                      ) : (
                        <span className='text-muted-foreground font-mono'>{0}</span>
                      )}
                    </td>

                    <td className='py-3.5 px-4 text-right font-bold text-foreground'>
                      {formatCurrency(item.monthlyCost)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
