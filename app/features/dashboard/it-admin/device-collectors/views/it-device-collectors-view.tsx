import {
  CheckCircle2,
  ChevronRight,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { itAdminDepartmentLabel } from '../../it-admin-demo-labels'

import {
  initialItDeptUsageSummaries,
  initialItEmployeeUsageRecords,
  type ItDeptUsageSummary,
  type ItEmployeeUsageRecord
} from '../../it-admin-data'
import type { ItAdminTabKey } from '../../it-admin-nav'
import { DeviceEmployeeTelemetryView } from '../components/device-employee-telemetry-view'
import { DevicePromptModal } from '../components/device-prompt-modal'

export type ItDeviceCollectorsViewProps = {
  initialDeptId?: string
  initialEmployeeId?: string
  fromTab?: string
  alertId?: string
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItDeviceCollectorsView({
  initialDeptId,
  initialEmployeeId,
  fromTab,
  alertId,
  onSelectTab
}: ItDeviceCollectorsViewProps) {
  const { t } = useTranslation('dashboard')
  const syncLabel = (value: string) => {
    const minutes = value.match(/^(\d+) phút trước$/)?.[1]
    if (minutes) return t('itAdmin.deviceCollectors.extra.syncMinutesAgo', { minutes })
    return value === 'Chưa có dữ liệu' ? t('itAdmin.deviceCollectors.extra.syncNoData') : value
  }

  const [deptSummaries] = useState<ItDeptUsageSummary[]>(initialItDeptUsageSummaries)
  const [employeeRecords] = useState<ItEmployeeUsageRecord[]>(initialItEmployeeUsageRecords)

  // Navigation: Level 1 (Phòng ban & Danh sách nhân sự) -> Level 2 (Chi tiết đo lường của nhân sự)
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDeptId || 'dept-eng')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(initialEmployeeId || null)

  // Token timeframe tab for AI Agent telemetry: Day, Week, Month
  const [tokenTimeframe, setTokenTimeframe] = useState<'day' | 'week' | 'month'>('week')
  const [searchQuery, setSearchQuery] = useState('')

  // Prompt View Modal
  const [selectedPrompt, setSelectedPrompt] = useState<{ tool: string; prompt: string; response: string } | null>(null)
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const currentDept = deptSummaries.find((d) => d.departmentId === selectedDeptId)
  const currentEmployee = employeeRecords.find((e) => e.id === selectedEmployeeId)

  // Filter employees inside selected department
  const filteredEmployees = employeeRecords.filter((emp) => {
    if (emp.departmentId !== selectedDeptId) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.software.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  return (
    <div className='space-y-6'>
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl'>
          <CheckCircle2 className='size-5 text-success shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      {currentEmployee ? (
        <DeviceEmployeeTelemetryView
          alertId={alertId}
          currentDept={currentDept}
          currentEmployee={currentEmployee}
          fromTab={fromTab}
          onBack={() => setSelectedEmployeeId(null)}
          onOpenPromptModal={(prompt) => {
            setSelectedPrompt(prompt)
            setIsPromptModalOpen(true)
          }}
          onSelectTab={onSelectTab}
          setTokenTimeframe={setTokenTimeframe}
          tokenTimeframe={tokenTimeframe}
        />
      ) : (
        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              {t('itAdmin.deviceCollectors.extra.usageByDepartment')}
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.deviceCollectors.extra.departmentHelp')}</p>
          </div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {deptSummaries.map((dept) => {
              const isSelected = selectedDeptId === dept.departmentId

              return (
                <div
                  className={`rounded-2xl border p-5 shadow-sm transition cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary-soft/40 ring-2 ring-primary'
                      : 'border-border bg-surface hover:border-primary/50'
                  }`}
                  key={dept.departmentId}
                  onClick={() => setSelectedDeptId(dept.departmentId)}
                >
                  <div className='flex items-center justify-between'>
                    <h3 className='text-base font-bold text-foreground'>
                      {itAdminDepartmentLabel(dept.departmentName)}
                    </h3>
                    <span className='text-xs text-muted-foreground'>
                      {dept.peopleWithData} {t('itAdmin.deviceCollectors.extra.employees')}
                    </span>
                  </div>

                  <div className='mt-4 grid grid-cols-2 gap-2 text-xs'>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>
                        {t('itAdmin.deviceCollectors.extra.trackedDevices')}
                      </span>
                      <span className='text-base font-bold text-foreground'>{dept.devicesActive}</span>
                    </div>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>
                        {t('itAdmin.deviceCollectors.extra.totalTime')}
                      </span>
                      <span className='text-base font-bold text-foreground'>{dept.totalDurationHours}h</span>
                    </div>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>
                        {t('itAdmin.deviceCollectors.extra.totalSessions')}
                      </span>
                      <span className='text-base font-bold text-foreground'>{dept.totalSessions}</span>
                    </div>
                    <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                      <span className='text-[0.65rem] text-muted-foreground block'>
                        {t('itAdmin.deviceCollectors.extra.tokensMeasured')}
                      </span>
                      <span className='text-base font-bold text-primary'>{dept.totalTokens}</span>
                    </div>
                  </div>

                  <div className='mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground'>
                    <span>
                      {t('itAdmin.deviceCollectors.extra.synced')} {syncLabel(dept.lastSync)}
                    </span>
                    <span className='font-bold text-primary'>{t('itAdmin.deviceCollectors.extra.viewDepartment')}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/80'>
              <div>
                <h3 className='text-base font-bold text-foreground'>
                  {t('itAdmin.deviceCollectors.extra.employeeList')}{' '}
                  {currentDept && itAdminDepartmentLabel(currentDept.departmentName)}
                </h3>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {t('itAdmin.deviceCollectors.extra.employeeListHelp')}
                </p>
              </div>

              <div className='flex items-center gap-3'>
                <div className='relative w-64'>
                  <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                  <input
                    className='h-9 w-full rounded-xl border border-border bg-surface-subtle pl-9 pr-3 text-xs outline-none focus:border-primary'
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('itAdmin.deviceCollectors.extra.search')}
                    type='search'
                    value={searchQuery}
                  />
                </div>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead className='border-b border-border bg-surface-subtle/80 text-[0.7rem] uppercase tracking-wider text-muted-foreground'>
                  <tr>
                    <th className='px-4 py-3'>{t('itAdmin.deviceCollectors.extra.employee')}</th>
                    <th className='px-3 py-3'>{t('itAdmin.deviceCollectors.extra.softwareAgent')}</th>
                    <th className='px-3 py-3 text-center'>{t('itAdmin.deviceCollectors.extra.daysUsed')}</th>
                    <th className='px-3 py-3 text-center'>{t('itAdmin.deviceCollectors.extra.time')}</th>
                    <th className='px-3 py-3 text-center'>Token</th>
                    <th className='px-4 py-3 text-center'>{t('itAdmin.deviceCollectors.extra.tokenTrend')}</th>
                    <th className='px-4 py-3 text-right'>{t('itAdmin.deviceCollectors.extra.actions')}</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border/60'>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td className='px-4 py-8 text-center text-muted-foreground' colSpan={7}>
                        {t('itAdmin.deviceCollectors.extra.empty')}
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr
                        className='cursor-pointer transition hover:bg-surface-subtle/80'
                        key={emp.id}
                        onClick={() => setSelectedEmployeeId(emp.id)}
                      >
                        <td className='px-4 py-3.5'>
                          <span className='font-bold text-foreground block'>{emp.name}</span>
                          <span className='text-[0.68rem] text-muted-foreground'>{emp.email}</span>
                        </td>
                        <td className='px-3 py-3.5'>
                          <div className='flex items-center gap-1.5'>
                            <span className='rounded bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary'>
                              {emp.software}
                            </span>
                            {emp.tokenAnalytics?.isAgent && (
                              <span title='AI Agent' className='inline-flex items-center'>
                                <Sparkles className='size-3 text-purple-500' />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className='px-3 py-3.5 text-center font-semibold text-foreground'>
                          {emp.activeDays} {t('itAdmin.deviceCollectors.extra.days')}
                        </td>
                        <td className='px-3 py-3.5 text-center text-muted-foreground'>
                          {Math.floor(emp.durationMinutes / 60)}h {emp.durationMinutes % 60}m
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold text-foreground'>
                          {(emp.inputTokens + emp.outputTokens).toLocaleString()}
                        </td>
                        <td className='px-4 py-3.5 text-center'>
                          {emp.tokenAnalytics ? (
                            emp.tokenAnalytics.growthStatus === 'increasing' ? (
                              <span className='inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[0.68rem] font-bold text-success border border-success/20'>
                                <TrendingUp className='size-3' />
                                <span>+{emp.tokenAnalytics.growthRate}%</span>
                              </span>
                            ) : (
                              <span className='inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-[0.68rem] font-bold text-danger border border-danger/20'>
                                <TrendingDown className='size-3' />
                                <span>{emp.tokenAnalytics.growthRate}%</span>
                              </span>
                            )
                          ) : (
                            <span className='text-muted-foreground text-[0.68rem]'>—</span>
                          )}
                        </td>
                        <td className='px-4 py-3.5 text-right'>
                          <button
                            className='flex items-center gap-1 ml-auto rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEmployeeId(emp.id)
                            }}
                            type='button'
                          >
                            <span>{t('itAdmin.deviceCollectors.extra.viewDetails')}</span>
                            <ChevronRight className='size-3.5' />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <DevicePromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        selectedPrompt={selectedPrompt}
      />
    </div>
  )
}
