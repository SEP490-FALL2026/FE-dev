import { Building2, CalendarDays, Camera, IdCard, UserRound } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { EmployeePreviewNotice } from '../employee-preview-notice'
import { employeeProfileData } from '../employee-data'

function ProfileField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className='border-b border-border/70 py-3.5 last:border-b-0'>
      <dt className='text-xs font-medium text-muted-foreground'>{label}</dt>
      <dd className={`mt-1 break-words text-sm font-semibold text-foreground ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  )
}

const acceptedAvatarTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxAvatarBytes = 2 * 1024 * 1024

export function EmployeeProfileView({
  avatarUrl,
  onAvatarSelect
}: {
  avatarUrl: string | null
  onAvatarSelect: (file: File) => void
}) {
  const { t } = useTranslation('dashboard')
  const { personal, organization } = employeeProfileData
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!acceptedAvatarTypes.has(file.type)) {
      setAvatarError(t('employee.profile.avatarInvalidType'))
      return
    }
    if (file.size > maxAvatarBytes) {
      setAvatarError(t('employee.profile.avatarTooLarge'))
      return
    }

    setAvatarError(null)
    onAvatarSelect(file)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('employee.profile.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('employee.profile.subtitle')}</p>
      </div>

      <EmployeePreviewNotice>{t('employee.preview.profile')}</EmployeePreviewNotice>

      <div className='max-w-6xl space-y-5'>
        <section className='relative overflow-hidden rounded-3xl border border-primary/25 bg-primary-soft/45 shadow-sm'>
          <div aria-hidden='true' className='absolute inset-y-0 left-0 w-1.5 bg-primary' />
          <div
            aria-hidden='true'
            className='absolute -right-12 -top-20 size-64 rounded-full border-[36px] border-primary/5'
          />
          <div className='relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8'>
            <div className='flex shrink-0 flex-col items-start gap-2'>
              <div className='grid size-20 place-items-center overflow-hidden rounded-2xl border border-primary/20 bg-surface text-primary shadow-sm sm:size-24'>
                {avatarUrl ? (
                  <img
                    alt={t('employee.profile.avatarAlt', { name: personal.fullName })}
                    className='size-full object-cover'
                    src={avatarUrl}
                  />
                ) : (
                  <UserRound aria-hidden='true' className='size-10 sm:size-12' strokeWidth={1.5} />
                )}
              </div>
              <input
                accept='image/jpeg,image/png,image/webp'
                aria-label={t('employee.profile.avatarChoose')}
                className='sr-only'
                onChange={handleAvatarChange}
                ref={avatarInputRef}
                tabIndex={-1}
                type='file'
              />
              <button
                className='inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-primary/25 bg-surface px-3 text-xs font-semibold text-primary-ink transition hover:border-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                onClick={() => avatarInputRef.current?.click()}
                type='button'
              >
                <Camera aria-hidden='true' className='size-4' />
                {t(avatarUrl ? 'employee.profile.avatarChange' : 'employee.profile.avatarChoose')}
              </button>
            </div>

            <div className='min-w-0 flex-1'>
              <p className='text-xs font-bold tracking-[0.14em] text-primary-ink uppercase'>
                {t('employee.profile.title')}
              </p>
              <h2 className='mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
                {personal.fullName}
              </h2>
              <p className='mt-1 text-base font-medium text-muted-foreground'>{personal.position}</p>
              <div className='mt-5 flex flex-wrap gap-2'>
                <span className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-3 py-1.5 text-xs font-semibold text-foreground'>
                  <IdCard aria-hidden='true' className='size-4 text-primary' />
                  {personal.employeeId}
                </span>
                <span className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-3 py-1.5 text-xs font-semibold text-foreground'>
                  <Building2 aria-hidden='true' className='size-4 text-primary' />
                  {organization.department}
                </span>
                <span className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-3 py-1.5 text-xs font-semibold text-foreground'>
                  <CalendarDays aria-hidden='true' className='size-4 text-primary' />
                  {personal.joinDate}
                </span>
              </div>
              <p className='mt-4 text-xs text-muted-foreground'>{t('employee.profile.avatarHint')}</p>
              {avatarError && (
                <p className='mt-2 text-xs font-medium text-danger' role='alert'>
                  {avatarError}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className='grid gap-5 lg:grid-cols-2'>
          <section className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'>
            <div className='flex items-center gap-3 border-b border-border pb-4'>
              <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary'>
                <UserRound aria-hidden='true' className='size-5' />
              </span>
              <h2 className='text-base font-bold text-foreground'>{t('employee.profile.personalInfoTitle')}</h2>
            </div>
            <dl className='grid gap-x-6 sm:grid-cols-2'>
              <ProfileField label={t('employee.profile.fieldFullName')} value={personal.fullName} />
              <ProfileField label={t('employee.profile.fieldEmployeeId')} value={personal.employeeId} mono />
              <ProfileField label={t('employee.profile.fieldEmail')} value={personal.email} />
              <ProfileField label={t('employee.profile.fieldPhone')} value={personal.phone} />
              <ProfileField label={t('employee.profile.fieldPosition')} value={personal.position} />
              <ProfileField label={t('employee.profile.fieldJoinDate')} value={personal.joinDate} />
            </dl>
          </section>

          <section className='rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6'>
            <div className='flex items-center gap-3 border-b border-border pb-4'>
              <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary'>
                <Building2 aria-hidden='true' className='size-5' />
              </span>
              <h2 className='text-base font-bold text-foreground'>{t('employee.profile.organizationTitle')}</h2>
            </div>
            <dl className='grid gap-x-6 sm:grid-cols-2'>
              <ProfileField label={t('employee.profile.fieldCompany')} value={organization.company} />
              <ProfileField label={t('employee.profile.fieldDepartment')} value={organization.department} />
              <ProfileField label={t('employee.profile.fieldDirectManager')} value={organization.directManager} />
              <ProfileField label={t('employee.profile.fieldCostCenter')} value={organization.costCenter} mono />
              <div className='sm:col-span-2'>
                <ProfileField label={t('employee.profile.fieldOffice')} value={organization.office} />
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}
