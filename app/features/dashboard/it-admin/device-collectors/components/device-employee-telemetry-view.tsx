import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Eye,
  Laptop,
  MessageSquare,
  Shield,
  Sparkles,
  Terminal
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'
import type { ItDeptUsageSummary, ItEmployeeUsageRecord } from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { DeviceTokenAnalyticsCard } from './device-token-analytics-card'

export interface DeviceEmployeeTelemetryViewProps {
  currentEmployee: ItEmployeeUsageRecord
  currentDept?: ItDeptUsageSummary
  fromTab?: string
  alertId?: string
  tokenTimeframe: 'day' | 'week' | 'month'
  setTokenTimeframe: (tf: 'day' | 'week' | 'month') => void
  onBack: () => void
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
  onOpenPromptModal: (prompt: { tool: string; prompt: string; response: string }) => void
}

export function DeviceEmployeeTelemetryView({
  currentEmployee,
  currentDept,
  fromTab,
  alertId,
  tokenTimeframe,
  setTokenTimeframe,
  onBack,
  onSelectTab,
  onOpenPromptModal
}: DeviceEmployeeTelemetryViewProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <button
          className='inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground transition hover:bg-surface-subtle shadow-sm'
          onClick={onBack}
          type='button'
        >
          <ArrowLeft className='size-4 text-primary' />
          <span>
            {t('itAdmin.deviceCollectors.extra.backToDecision', { defaultValue: 'Quay lại' })}{' '}
            ({currentDept ? itAdminDepartmentLabel(currentDept.departmentName) : ''})
          </span>
        </button>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-bold text-muted-foreground'>
              {currentDept ? itAdminDepartmentLabel(currentDept.departmentName) : ''}
            </span>
            <span className='rounded-md bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary'>
              {currentEmployee.software}
            </span>
            {currentEmployee.tokenAnalytics?.isAgent && (
              <span className='inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-600 dark:text-purple-400'>
                <Sparkles className='size-3' />
                <span>AI Agent Telemetry</span>
              </span>
            )}
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1'>
            {currentEmployee.name} ({currentEmployee.email})
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {t('itAdmin.deviceCollectors.extra.employeeListHelp', { defaultValue: 'Chi tiết nhân sự' })}
          </p>
        </div>

        <div className='flex items-center gap-3'>
          {onSelectTab && (
            <button
              className='flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary transition hover:bg-primary/20'
              onClick={() =>
                onSelectTab('reconciliation', {
                  dept: currentEmployee.departmentId,
                  software: currentEmployee.software
                })
              }
              type='button'
            >
              <Boxes className='size-4' />
              <span>{t('itAdmin.deviceCollectors.extra.actions', { defaultValue: 'Đối soát' })}</span>
            </button>
          )}
        </div>
      </div>

      {fromTab === 'optimization' && alertId && (
        <div className='rounded-2xl border border-primary/40 bg-primary/5 p-4 shadow-sm flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold text-xs shrink-0'>
              <Sparkles className='size-4' />
            </div>
            <div>
              <p className='text-xs font-bold text-foreground'>
                {t('itAdmin.deviceCollectors.extra.backOptimization', { defaultValue: 'Tối ưu hóa' })}
              </p>
              <p className='text-[0.7rem] text-muted-foreground'>
                {t('itAdmin.deviceCollectors.extra.summaryActiveDesc', { defaultValue: 'Đang theo dõi sử dụng' })}
              </p>
            </div>
          </div>
          {onSelectTab && (
            <button
              className='flex items-center gap-1 text-xs font-bold text-primary hover:underline'
              onClick={() => onSelectTab('license-optimization')}
              type='button'
            >
              <span>{t('itAdmin.deviceCollectors.extra.backOptimization', { defaultValue: 'Quay lại phương án' })}</span>
              <ArrowRight className='size-3.5' />
            </button>
          )}
        </div>
      )}

      {currentEmployee.tokenAnalytics && (
        <DeviceTokenAnalyticsCard
          currentEmployee={currentEmployee}
          setTokenTimeframe={setTokenTimeframe}
          tokenTimeframe={tokenTimeframe}
        />
      )}

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <span className='text-xs font-semibold text-muted-foreground'>
            {t('itAdmin.deviceCollectors.extra.totalDuration')}
          </span>
          <p className='mt-2 text-2xl font-bold text-foreground'>
            {Math.floor(currentEmployee.durationMinutes / 60)}h {currentEmployee.durationMinutes % 60}m
          </p>
          <span className='text-[0.7rem] text-muted-foreground block mt-1'>
            {t('itAdmin.deviceCollectors.extra.frequency')} {currentEmployee.frequency}
          </span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <span className='text-xs font-semibold text-muted-foreground'>
            {t('itAdmin.deviceCollectors.extra.activeDays')}
          </span>
          <p className='mt-2 text-2xl font-bold text-foreground'>
            {currentEmployee.activeDays}{' '}
            <span className='text-xs text-muted-foreground font-normal'>
              {t('itAdmin.deviceCollectors.extra.daysOfThirty')}
            </span>
          </p>
          <span className='text-[0.7rem] text-muted-foreground block mt-1'>
            {t('itAdmin.deviceCollectors.extra.lastUsed')} {currentEmployee.lastUsed}
          </span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-muted-foreground'>
              {t('itAdmin.deviceCollectors.extra.recordedTokens')}
            </span>
            {currentEmployee.isEstimatedTokens && (
              <span className='rounded bg-warning/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-warning border border-warning/20'>
                {t('itAdmin.deviceCollectors.extra.estimate')}
              </span>
            )}
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>
            {(currentEmployee.inputTokens + currentEmployee.outputTokens).toLocaleString()}
          </p>
          <span className='text-[0.7rem] text-muted-foreground block mt-1'>
            Input: {currentEmployee.inputTokens.toLocaleString()} · Output:{' '}
            {currentEmployee.outputTokens.toLocaleString()}
          </span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <span className='text-xs font-semibold text-muted-foreground'>
            {t('itAdmin.deviceCollectors.extra.dataSource')}
          </span>
          <p className='mt-2 text-xs font-bold text-foreground truncate' title={currentEmployee.tokenSource}>
            {currentEmployee.tokenSource}
          </p>
          <span className='text-[0.7rem] text-muted-foreground block mt-1'>
            {t('itAdmin.deviceCollectors.extra.apiSync')}
          </span>
        </div>
      </div>

      <div className='rounded-2xl border border-primary/30 bg-primary-soft/20 p-5'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div className='flex items-start gap-3'>
            <div className='grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shrink-0 shadow-sm'>
              <Laptop className='size-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='text-sm font-bold text-foreground'>
                  {t('itAdmin.deviceCollectors.extra.identifiedWorkstation')}
                </h3>
                <span className='inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/15 px-2 py-0.5 text-[0.68rem] font-bold text-success'>
                  <span className='size-1.5 rounded-full bg-success animate-pulse' />
                  <span>{t('itAdmin.deviceCollectors.extra.trackingToolActive')}</span>
                </span>
              </div>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {t('itAdmin.deviceCollectors.extra.workstationIdentityHelp')}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 font-mono text-xs'>
            <span className='rounded-xl border border-border bg-surface px-3 py-1.5 font-bold text-foreground'>
              {currentEmployee.sessions[0]?.device || 'DEV-WIN-2026-041'}
            </span>
          </div>
        </div>

        <div className='mt-3.5 pt-3 border-t border-border/80 grid gap-2 sm:grid-cols-3 text-xs'>
          <div>
            <span className='text-muted-foreground block text-[0.68rem]'>
              {t('itAdmin.deviceCollectors.extra.colDevice', { defaultValue: 'Mã thiết bị:' })}
            </span>
            <span className='font-mono font-bold text-primary'>
              {currentEmployee.sessions[0]?.device || 'DEV-WIN-2026-041'}
            </span>
          </div>
          <div>
            <span className='text-muted-foreground block text-[0.68rem]'>
              {t('itAdmin.deviceCollectors.extra.deviceHardwareId')}
            </span>
            <span className='font-mono font-semibold text-foreground'>
              MAC: 00:1A:2B:3C:4D:5E • SN: PF-99182A
            </span>
          </div>
          <div>
            <span className='text-muted-foreground block text-[0.68rem]'>
              {t('itAdmin.deviceCollectors.extra.trackingToolStatus')}
            </span>
            <span className='font-semibold text-success flex items-center gap-1 mt-0.5'>
              <CheckCircle2 className='size-3.5' />
              <span>Agent v2.4.1 (Online)</span>
            </span>
          </div>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
          <div className='flex items-center justify-between pb-3 border-b border-border/80'>
            <div>
              <h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
                {t('itAdmin.deviceCollectors.extra.sessions')}
              </h3>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {t('itAdmin.deviceCollectors.extra.sessionsHelp')}
              </p>
            </div>
            <Clock className='size-4 text-muted-foreground' />
          </div>

          <div className='space-y-3'>
            {currentEmployee.sessions.length === 0 ? (
              <div className='rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground'>
                {t('itAdmin.deviceCollectors.extra.noSessions')}
              </div>
            ) : (
              currentEmployee.sessions.map((ses) => (
                <div
                  className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-1.5 text-xs'
                  key={ses.id}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-bold text-foreground'>{ses.app}</span>
                    <span className='rounded bg-primary-soft px-2 py-0.5 text-[0.68rem] font-bold text-primary'>
                      {t('itAdmin.deviceCollectors.extra.duration')} {ses.duration}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-[0.7rem] text-muted-foreground'>
                    <span>
                      {t('itAdmin.deviceCollectors.extra.from')} {ses.startTime}{' '}
                      {t('itAdmin.deviceCollectors.extra.to')} {ses.endTime}
                    </span>
                    <span>{ses.device}</span>
                  </div>
                  <div className='text-[0.65rem] text-muted-foreground'>
                    {t('itAdmin.deviceCollectors.extra.source')} {ses.source}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
          <div className='flex items-center justify-between pb-3 border-b border-border/80'>
            <div>
              <h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground'>
                {t('itAdmin.deviceCollectors.extra.promptHistory')}
              </h3>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {t('itAdmin.deviceCollectors.extra.promptHelp')}
              </p>
            </div>
            <Terminal className='size-4 text-muted-foreground' />
          </div>

          {currentEmployee.promptHistory === null ? (
            <div className='rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground space-y-2'>
              <Shield className='size-8 mx-auto opacity-40' />
              <p className='text-sm font-bold text-foreground'>{t('itAdmin.deviceCollectors.extra.noPrompts')}</p>
              <p className='text-xs leading-relaxed max-w-sm mx-auto'>
                {t('itAdmin.deviceCollectors.extra.telemetryIntro')}
                {currentEmployee.tokenSource}
                {t('itAdmin.deviceCollectors.extra.telemetryEnd')}
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {currentEmployee.promptHistory.map((prm) => (
                <div
                  className='rounded-xl border border-border bg-surface-subtle p-3.5 space-y-2 text-xs'
                  key={prm.id}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-bold text-foreground'>{prm.tool}</span>
                    <span className='text-[0.7rem] text-muted-foreground'>{prm.time}</span>
                  </div>
                  <p className='text-muted-foreground italic font-mono bg-surface p-2.5 rounded-lg border border-border/60'>
                    "{prm.promptPreview}"
                  </p>
                  <div className='flex items-center justify-between pt-1'>
                    <span className='text-[0.65rem] text-muted-foreground'>
                      {t('itAdmin.deviceCollectors.extra.redacted')}
                    </span>
                    <button
                      className='flex items-center gap-1 text-xs font-bold text-primary hover:underline'
                      onClick={() =>
                        onOpenPromptModal({
                          tool: prm.tool,
                          prompt: prm.fullPrompt,
                          response: prm.response
                        })
                      }
                      type='button'
                    >
                      <Eye className='size-3.5' />
                      <span>{t('itAdmin.deviceCollectors.extra.revealContent')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
