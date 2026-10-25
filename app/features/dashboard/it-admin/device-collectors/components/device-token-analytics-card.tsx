import { Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ItEmployeeUsageRecord, TokenTrendPoint } from '../../it-admin-data'

export interface DeviceTokenAnalyticsCardProps {
  currentEmployee: ItEmployeeUsageRecord
  tokenTimeframe: 'day' | 'week' | 'month'
  setTokenTimeframe: (tf: 'day' | 'week' | 'month') => void
}

export function DeviceTokenAnalyticsCard({
  currentEmployee,
  tokenTimeframe,
  setTokenTimeframe
}: DeviceTokenAnalyticsCardProps) {
  const { t } = useTranslation('dashboard')

  if (!currentEmployee.tokenAnalytics) return null

  const activeTokenPoints: TokenTrendPoint[] =
    tokenTimeframe === 'day'
      ? currentEmployee.tokenAnalytics.dayData
      : tokenTimeframe === 'week'
        ? currentEmployee.tokenAnalytics.weekData
        : currentEmployee.tokenAnalytics.monthData

  const maxTokenValue = Math.max(...activeTokenPoints.map((p) => p.totalTokens), 1)

  return (
    <div className='rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 shadow-sm space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='grid size-10 place-items-center rounded-xl bg-purple-500 text-white shadow-sm'>
            <Sparkles className='size-5' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h3 className='text-base font-bold text-foreground'>
                {t('itAdmin.deviceCollectors.extra.tokenBars', { defaultValue: 'Thống kê tiêu thụ Token AI' })}
              </h3>
              <span className='rounded bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-600 dark:text-purple-400'>
                {currentEmployee.software}
              </span>
            </div>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {t('itAdmin.deviceCollectors.extra.tokenChartHelp', { defaultValue: 'Biểu đồ chi tiết số lượng token tiêu thụ' })}
            </p>
          </div>
        </div>

        <div className='flex items-center rounded-xl border border-border bg-surface p-1 text-xs font-semibold'>
          <button
            className={`rounded-lg px-3 py-1.5 transition ${
              tokenTimeframe === 'day'
                ? 'bg-primary text-primary-foreground font-bold shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTokenTimeframe('day')}
            type='button'
          >
            {t('itAdmin.deviceCollectors.extra.daily')}
          </button>
          <button
            className={`rounded-lg px-3 py-1.5 transition ${
              tokenTimeframe === 'week'
                ? 'bg-primary text-primary-foreground font-bold shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTokenTimeframe('week')}
            type='button'
          >
            {t('itAdmin.deviceCollectors.extra.weekly')}
          </button>
          <button
            className={`rounded-lg px-3 py-1.5 transition ${
              tokenTimeframe === 'month'
                ? 'bg-primary text-primary-foreground font-bold shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setTokenTimeframe('month')}
            type='button'
          >
            {t('itAdmin.deviceCollectors.extra.monthly')}
          </button>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='rounded-xl border border-border bg-surface-subtle p-4'>
          <span className='text-xs text-muted-foreground'>
            {t('itAdmin.deviceCollectors.extra.currentTokens')}
            {tokenTimeframe === 'day'
              ? t('itAdmin.deviceCollectors.extra.today')
              : tokenTimeframe === 'week'
                ? t('itAdmin.deviceCollectors.extra.thisWeek')
                : t('itAdmin.deviceCollectors.extra.thisMonth')}
            ):
          </span>
          <p className='text-2xl font-black text-foreground mt-1'>
            {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].current.toLocaleString()}
          </p>
          <span className='text-[0.7rem] text-muted-foreground mt-0.5 block'>
            {t('itAdmin.deviceCollectors.extra.vsPrevious')}{' '}
            {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].previous.toLocaleString()}
          </span>
        </div>

        <div className='rounded-xl border border-border bg-surface-subtle p-4'>
          <span className='text-xs text-muted-foreground'>
            {t('itAdmin.deviceCollectors.extra.tokenChange')}
          </span>
          <div className='flex items-center gap-2 mt-1'>
            {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent >= 0 ? (
              <TrendingUp className='size-5 text-success' />
            ) : (
              <TrendingDown className='size-5 text-danger' />
            )}
            <span
              className={`text-2xl font-black ${
                currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent >= 0
                  ? 'text-success'
                  : 'text-danger'
              }`}
            >
              {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent > 0 ? '+' : ''}
              {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent}%
            </span>
          </div>
          <span className='text-[0.7rem] text-muted-foreground mt-0.5 block'>
            {currentEmployee.tokenAnalytics.periodSummaries[tokenTimeframe].percent < 0
              ? t('itAdmin.deviceCollectors.extra.decliningUsage')
              : t('itAdmin.deviceCollectors.extra.healthyUsage')}
          </span>
        </div>

        <div className='rounded-xl border border-border bg-surface-subtle p-4'>
          <span className='text-xs text-muted-foreground'>
            {t('itAdmin.deviceCollectors.extra.totalTokens')}
          </span>
          <p className='text-2xl font-black text-foreground mt-1'>
            {(currentEmployee.inputTokens + currentEmployee.outputTokens).toLocaleString()}
          </p>
          <span className='text-[0.7rem] text-muted-foreground mt-0.5 block'>
            Input: {currentEmployee.inputTokens.toLocaleString()} · Output:{' '}
            {currentEmployee.outputTokens.toLocaleString()}
          </span>
        </div>
      </div>

      <div className='space-y-2 pt-2'>
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>
            {t('itAdmin.deviceCollectors.extra.tokenBars')}
            {tokenTimeframe === 'day'
              ? t('itAdmin.deviceCollectors.extra.sevenDays')
              : tokenTimeframe === 'week'
                ? t('itAdmin.deviceCollectors.extra.fourWeeks')
                : t('itAdmin.deviceCollectors.extra.threeMonths')}
            )
          </span>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1.5'>
              <span className='size-3 rounded-sm bg-primary/70' />
              <span>Input Tokens</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='size-3 rounded-sm bg-primary' />
              <span>Output Tokens</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-7 gap-3 pt-6 pb-2 items-end min-h-[220px] rounded-xl border border-border/80 bg-surface-subtle/50 px-4'>
          {activeTokenPoints.map((point) => {
            const totalPercent = Math.max(
              (point.totalTokens / maxTokenValue) * 100,
              point.totalTokens > 0 ? 8 : 2
            )
            const inputShare = point.totalTokens > 0 ? (point.inputTokens / point.totalTokens) * 100 : 50

            return (
              <div className='flex flex-col items-center gap-2 h-full justify-end group' key={point.label}>
                <div className='opacity-0 group-hover:opacity-100 transition text-[0.65rem] font-mono font-bold text-foreground text-center'>
                  {point.totalTokens.toLocaleString()}
                </div>
                <div
                  className='w-full max-w-[42px] rounded-t-lg bg-surface flex flex-col justify-end overflow-hidden border border-border shadow-sm'
                  style={{ height: `${totalPercent}%` }}
                >
                  <div
                    className='w-full bg-primary/60 transition'
                    style={{ height: `${inputShare}%` }}
                    title={`Input: ${point.inputTokens.toLocaleString()}`}
                  />
                  <div
                    className='w-full bg-primary transition'
                    style={{ height: `${100 - inputShare}%` }}
                    title={`Output: ${point.outputTokens.toLocaleString()}`}
                  />
                </div>
                <span className='text-xs font-semibold text-foreground'>{point.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
