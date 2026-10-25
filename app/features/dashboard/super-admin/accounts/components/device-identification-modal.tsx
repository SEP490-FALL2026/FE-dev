import { AlertTriangle, CheckCircle2, Laptop, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { EmployeeDevice, UserAccount } from '../../super-admin-data'
import type { DeviceType } from '../../enums'

export interface DeviceIdentificationModalProps {
  accounts: UserAccount[]
  devFormCode: string
  devFormEmployeeId: string
  devFormError: string | null
  devFormMac: string
  devFormOs: string
  devFormType: DeviceType
  deviceModalExistingDevice: EmployeeDevice | null
  deviceModalTargetAccount: UserAccount | null
  devices: EmployeeDevice[]
  isOpen: boolean
  onClose: () => void
  onSaveDeviceBinding: (e: React.FormEvent) => void
  setDevFormCode: (code: string) => void
  setDevFormEmployeeId: (id: string) => void
  setDevFormMac: (mac: string) => void
  setDevFormOs: (os: string) => void
  setDevFormType: (type: DeviceType) => void
}

export function DeviceIdentificationModal({
  accounts,
  devFormCode,
  devFormEmployeeId,
  devFormError,
  devFormMac,
  devFormOs,
  devFormType,
  deviceModalExistingDevice,
  deviceModalTargetAccount,
  devices,
  isOpen,
  onClose,
  onSaveDeviceBinding,
  setDevFormCode,
  setDevFormEmployeeId,
  setDevFormMac,
  setDevFormOs,
  setDevFormType
}: DeviceIdentificationModalProps) {
  const { t } = useTranslation('dashboard')

  if (!isOpen) return null

  const employeeAccounts = accounts.filter((a) => a.role === 'EMPLOYEE')
  const unassignedDevs = devices.filter((d) => !d.assignedEmployeeId)

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]'>
      <div className='relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl'>
        <button
          className='absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          onClick={onClose}
          type='button'
        >
          <X className='size-5' />
        </button>

        <div className='flex items-center gap-2.5'>
          <div className='grid size-9 place-items-center rounded-xl bg-primary-soft text-primary'>
            <Laptop className='size-5' />
          </div>
          <div>
            <h2 className='text-base font-bold text-foreground'>
              {deviceModalExistingDevice
                ? t('superAdmin.accounts.deviceModal.titleUpdate')
                : t('superAdmin.accounts.deviceModal.titleNew')}
            </h2>
            <p className='text-[0.7rem] text-muted-foreground'>
              {t('superAdmin.accounts.deviceModal.subtitle')}
            </p>
          </div>
        </div>

        <div className='mt-3 rounded-xl border border-primary/20 bg-primary-soft/30 p-3 text-xs text-foreground'>
          <p className='font-bold text-primary flex items-center gap-1.5'>
            <CheckCircle2 className='size-3.5' />
            {t('superAdmin.accounts.deviceModal.telemetryPrincipleTitle')}
          </p>
          <p className='mt-1 text-[0.68rem] leading-relaxed text-muted-foreground'>
            {t('superAdmin.accounts.deviceModal.telemetryPrincipleDesc')}
          </p>
        </div>

        {devFormError && (
          <div className='mt-3 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger'>
            <AlertTriangle className='size-4 shrink-0' />
            <span>{devFormError}</span>
          </div>
        )}

        <form className='mt-4 space-y-3 text-xs' onSubmit={onSaveDeviceBinding}>
          <div>
            <label className='block font-bold text-foreground mb-1'>
              {t('superAdmin.accounts.deviceModal.employeeLabel')} <span className='text-danger'>*</span>
            </label>
            <select
              className='w-full rounded-xl border border-border bg-background p-2.5 font-semibold focus:border-primary focus:outline-none'
              disabled={!!deviceModalTargetAccount}
              onChange={(e) => setDevFormEmployeeId(e.target.value)}
              value={devFormEmployeeId}
            >
              <option value=''>{t('superAdmin.accounts.deviceModal.selectEmployeePlaceholder')}</option>
              {employeeAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.employeeCode}) — {acc.departmentName || ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block font-bold text-foreground mb-1'>
              {t('superAdmin.accounts.deviceModal.deviceCodeLabel')} <span className='text-danger'>*</span>
            </label>
            <input
              className='w-full rounded-xl border border-border bg-background p-2.5 font-mono font-bold uppercase focus:border-primary focus:outline-none'
              list='company-hardware-codes'
              onChange={(e) => {
                const val = e.target.value.toUpperCase()
                setDevFormCode(val)
                const matched = devices.find((d) => d.deviceCode.toUpperCase() === val)
                if (matched) {
                  setDevFormType((matched.deviceType as DeviceType) || 'LAPTOP')
                  setDevFormOs(matched.os)
                  setDevFormMac(matched.macAddress)
                }
              }}
              placeholder={t('superAdmin.accounts.deviceModal.deviceCodePlaceholder')}
              required
              type='text'
              value={devFormCode}
            />
            <datalist id='company-hardware-codes'>
              {unassignedDevs.map((d) => (
                <option key={d.id} value={d.deviceCode}>
                  {d.hostname} - {d.manufacturerModel} ({d.macAddress})
                </option>
              ))}
            </datalist>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <label className='block font-bold text-foreground mb-1'>
                {t('superAdmin.accounts.deviceModal.deviceTypeLabel')}
              </label>
              <select
                className='w-full rounded-xl border border-border bg-background p-2.5 font-semibold focus:border-primary focus:outline-none'
                onChange={(e) => setDevFormType(e.target.value as DeviceType)}
                value={devFormType}
              >
                <option value='LAPTOP'>{t('superAdmin.accounts.deviceModal.typeLaptop')}</option>
                <option value='DESKTOP'>{t('superAdmin.accounts.deviceModal.typeDesktop')}</option>
                <option value='WORKSTATION'>{t('superAdmin.accounts.deviceModal.typeWorkstation')}</option>
                <option value='MACBOOK'>{t('superAdmin.accounts.deviceModal.typeMacbook')}</option>
              </select>
            </div>

            <div>
              <label className='block font-bold text-foreground mb-1'>
                {t('superAdmin.accounts.deviceModal.osLabel')}
              </label>
              <input
                className='w-full rounded-xl border border-border bg-background p-2.5 focus:border-primary focus:outline-none'
                onChange={(e) => setDevFormOs(e.target.value)}
                placeholder={t('superAdmin.accounts.deviceModal.osPlaceholder')}
                type='text'
                value={devFormOs}
              />
            </div>
          </div>

          <div>
            <label className='block font-bold text-foreground mb-1'>
              {t('superAdmin.accounts.deviceModal.macLabel')}
            </label>
            <input
              className='w-full rounded-xl border border-border bg-surface-subtle p-2.5 font-mono font-bold text-muted-foreground cursor-not-allowed select-none uppercase'
              disabled
              readOnly
              type='text'
              value={devFormMac || t('superAdmin.accounts.deviceModal.macAutoPlaceholder')}
            />
          </div>

          <div className='flex items-center justify-end gap-3 border-t border-border pt-4'>
            <button
              className='rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-subtle transition'
              onClick={onClose}
              type='button'
            >
              {t('superAdmin.accounts.deviceModal.cancelBtn')}
            </button>
            <button
              className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition'
              type='submit'
            >
              {t('superAdmin.accounts.deviceModal.saveBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
