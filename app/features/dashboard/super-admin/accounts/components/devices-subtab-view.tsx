import { AlertTriangle, Laptop, Monitor, Plus, Search, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { EmployeeDevice, UserAccount } from '../../super-admin-data'

export interface DevicesSubtabViewProps {
  accounts: UserAccount[]
  deviceSearchTerm: string
  deviceTypeFilter: string
  devices: EmployeeDevice[]
  onOpenDeviceModal: (acc?: UserAccount) => void
  onUnbindDevice: (device: EmployeeDevice) => void
  setDeviceSearchTerm: (val: string) => void
  setDeviceTypeFilter: (val: string) => void
}

export function DevicesSubtabView({
  accounts,
  deviceSearchTerm,
  deviceTypeFilter,
  devices,
  onOpenDeviceModal,
  onUnbindDevice,
  setDeviceSearchTerm,
  setDeviceTypeFilter
}: DevicesSubtabViewProps) {
  const { t } = useTranslation('dashboard')
  const unassigned = accounts.filter(
    (a) => a.role === 'EMPLOYEE' && !devices.some((d) => d.assignedEmployeeId === a.id)
  )

  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-muted-foreground'>
              {t('superAdmin.accounts.devices.boundDevicesTitle')}
            </span>
            <Laptop className='size-4 text-primary' />
          </div>
          <p className='mt-2 text-2xl font-black text-foreground'>{devices.filter((d) => Boolean(d.assignedEmployeeId)).length}</p>
          <span className='text-[0.7rem] text-muted-foreground'>
            {t('superAdmin.accounts.devices.boundDevicesHint')}
          </span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-muted-foreground'>
              {t('superAdmin.accounts.devices.inventoryTitle')}
            </span>
            <Monitor className='size-4 text-primary' />
          </div>
          <p className='mt-2 text-2xl font-black text-foreground'>{devices.filter((d) => !d.assignedEmployeeId).length}</p>
          <span className='text-[0.7rem] text-muted-foreground'>
            {t('superAdmin.accounts.devices.inventoryHint')}
          </span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-warning'>
              {t('superAdmin.accounts.devices.unassignedEmployeesTitle')}
            </span>
            <AlertTriangle className='size-4 text-warning' />
          </div>
          <p className='mt-2 text-2xl font-black text-warning'>{unassigned.length}</p>
          <span className='text-[0.7rem] text-muted-foreground'>
            {t('superAdmin.accounts.devices.unassignedEmployeesHint')}
          </span>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-muted-foreground'>
              {t('superAdmin.accounts.devices.windowsStandardTitle')}
            </span>
            <Laptop className='size-4 text-success' />
          </div>
          <p className='mt-2 text-2xl font-black text-success'>
            {t('superAdmin.accounts.devices.windowsStandardValue')}
          </p>
          <span className='text-[0.7rem] text-muted-foreground'>
            {t('superAdmin.accounts.devices.windowsStandardHint')}
          </span>
        </div>
      </div>

      <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='grid gap-3 sm:grid-cols-3 flex-1'>
            <div className='relative sm:col-span-2'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
              <input
                aria-label={t('superAdmin.accounts.devices.searchPlaceholder')}
                className='w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs focus:border-primary focus:outline-none'
                onChange={(e) => setDeviceSearchTerm(e.target.value)}
                placeholder={t('superAdmin.accounts.devices.searchPlaceholder')}
                type='search'
                value={deviceSearchTerm}
              />
            </div>

            <div>
              <select
                aria-label={t('superAdmin.accounts.devices.typeFilterAll')}
                className='w-full rounded-xl border border-border bg-background p-2 text-xs font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setDeviceTypeFilter(e.target.value)}
                value={deviceTypeFilter}
              >
                <option value='ALL'>{t('superAdmin.accounts.devices.typeFilterAll')}</option>
                <option value='LAPTOP'>{t('superAdmin.accounts.devices.typeFilterLaptop')}</option>
                <option value='DESKTOP'>{t('superAdmin.accounts.devices.typeFilterDesktop')}</option>
              </select>
            </div>
          </div>

          <button
            className='inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover shrink-0'
            onClick={() => onOpenDeviceModal()}
            type='button'
          >
            <Plus className='size-4' />
            <span>{t('superAdmin.accounts.devices.addDeviceBtn')}</span>
          </button>
        </div>
      </div>

      <div className='rounded-2xl border border-border bg-surface shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead>
              <tr className='border-b border-border text-muted-foreground bg-surface-subtle/50'>
                <th className='p-3 font-semibold'>{t('superAdmin.accounts.devices.colEmployee')}</th>
                <th className='p-3 font-semibold'>{t('superAdmin.accounts.devices.colDeviceCode')}</th>
                <th className='p-3 font-semibold'>{t('superAdmin.accounts.devices.colType')}</th>
                <th className='p-3 font-semibold'>{t('superAdmin.accounts.devices.colMac')}</th>
                <th className='p-3 font-semibold'>{t('superAdmin.accounts.devices.colOs')}</th>
                <th className='p-3 font-semibold text-right'>{t('superAdmin.accounts.devices.colActions')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {devices
                .filter((dev) => Boolean(dev.assignedEmployeeId))
                .filter((dev) => {
                  const q = deviceSearchTerm.toLowerCase()
                  const matchesSearch =
                    (dev.assignedEmployeeName || '').toLowerCase().includes(q) ||
                    (dev.assignedEmployeeCode || '').toLowerCase().includes(q) ||
                    dev.deviceCode.toLowerCase().includes(q) ||
                    dev.macAddress.toLowerCase().includes(q)

                  const matchesType = deviceTypeFilter === 'ALL' || dev.deviceType === deviceTypeFilter

                  return matchesSearch && matchesType
                })
                .map((dev) => {
                  const acc = accounts.find((a) => a.id === dev.assignedEmployeeId)

                  return (
                    <tr className='transition hover:bg-surface-subtle/60' key={dev.id}>
                      <td className='p-3'>
                        <div className='flex items-center gap-1.5'>
                          <span className='font-bold text-foreground'>{dev.assignedEmployeeName}</span>
                          <span className='font-mono text-[0.7rem] text-primary font-semibold'>
                            ({dev.assignedEmployeeCode})
                          </span>
                        </div>
                        <div className='flex items-center gap-1.5 text-[0.7rem] text-muted-foreground mt-0.5'>
                          <span>{dev.departmentName || t('superAdmin.accounts.unassignedDept')}</span>
                          {acc && (
                            <span className='rounded bg-surface-subtle px-1.5 py-0.5 border border-border text-[0.65rem] font-semibold text-primary'>
                              {t(`superAdmin.accounts.roles.names.${acc.role}`)}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className='p-3'>
                        <span className='font-mono font-bold text-foreground text-xs bg-surface-subtle border border-border px-2 py-1 rounded-lg inline-block'>
                          {dev.deviceCode}
                        </span>
                      </td>

                      <td className='p-3'>
                        <div className='flex items-center gap-2'>
                          <div className='grid size-7 place-items-center rounded-lg bg-primary-soft text-primary shrink-0'>
                            {dev.deviceType === 'DESKTOP' ? (
                              <Monitor className='size-3.5' />
                            ) : (
                              <Laptop className='size-3.5' />
                            )}
                          </div>
                          <span className='font-medium text-foreground text-xs'>
                            {dev.deviceType === 'DESKTOP'
                              ? t('superAdmin.accounts.devices.typeDesktopLabel')
                              : t('superAdmin.accounts.devices.typeLaptopLabel')}
                          </span>
                        </div>
                      </td>

                      <td className='p-3'>
                        <span className='font-mono font-bold text-primary text-xs'>{dev.macAddress}</span>
                      </td>

                      <td className='p-3'>
                        <span className='font-medium text-foreground'>{dev.os}</span>
                      </td>

                      <td className='p-3 text-right'>
                        <button
                          aria-label={t('superAdmin.accounts.devices.deleteTitle')}
                          className='inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20 transition'
                          onClick={() => onUnbindDevice(dev)}
                          title={t('superAdmin.accounts.devices.deleteTitle')}
                          type='button'
                        >
                          <Trash2 className='size-3.5' />
                          <span>{t('superAdmin.accounts.devices.deleteBtn')}</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}

              {devices.filter((dev) => Boolean(dev.assignedEmployeeId)).length === 0 && (
                <tr>
                  <td className='p-8 text-center text-muted-foreground italic' colSpan={6}>
                    {t('superAdmin.accounts.devices.emptyDevices')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {unassigned.length > 0 && (
        <div className='rounded-2xl border border-warning/30 bg-surface p-4 shadow-sm'>
          <div className='flex items-start gap-3'>
            <div className='grid size-9 place-items-center rounded-xl bg-warning/20 text-warning shrink-0'>
              <AlertTriangle className='size-5' />
            </div>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-bold text-foreground'>
                  {t('superAdmin.accounts.devices.warningTitle', { count: unassigned.length })}
                </h4>
                <span className='rounded bg-warning/20 px-2 py-0.5 text-xs font-bold text-warning'>
                  {t('superAdmin.accounts.devices.warningBadge')}
                </span>
              </div>
              <p className='mt-1 text-xs text-muted-foreground leading-relaxed'>
                {t('superAdmin.accounts.devices.warningDesc')}
              </p>

              <div className='mt-3 grid gap-2 sm:grid-cols-3'>
                {unassigned.map((emp) => (
                  <div
                    className='flex items-center justify-between rounded-xl border border-border bg-surface-subtle p-2.5 text-xs'
                    key={emp.id}
                  >
                    <div>
                      <span className='font-bold text-foreground block'>{emp.name}</span>
                      <span className='text-[0.7rem] text-muted-foreground font-mono'>
                        {emp.employeeCode} • {emp.departmentName || t('superAdmin.accounts.unassignedDept')}
                      </span>
                    </div>
                    <button
                      className='inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[0.7rem] font-bold text-primary-foreground shadow-sm hover:bg-primary-hover shrink-0'
                      onClick={() => onOpenDeviceModal(emp)}
                      type='button'
                    >
                      <Laptop className='size-3' />
                      <span>{t('superAdmin.accounts.devices.bindNowBtn')}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
