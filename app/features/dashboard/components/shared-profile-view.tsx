import type { ReactNode } from 'react'
import { KeyRound, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { MyProfileEditor } from '~/entities/user/components/my-profile-editor'
import { useMeGet } from '~/shared/api/generated/operations/me/me-get'

export function SharedProfileView({ additionalDetails }: { additionalDetails?: ReactNode }) {
  const { t } = useTranslation('employee')
  const query = useMeGet()
  const user = !query.isError ? query.data?.data : undefined
  return (
    <div className='space-y-6'>
      <h1 className='flex items-center gap-3 text-2xl font-semibold tracking-tight'>
        <UserRound aria-hidden strokeWidth={1.5} className='size-6' />
        {t('profile')}
      </h1>
      {query.isPending && <p role='status'>{t('loading')}</p>}
      {query.isError && (
        <div role='alert' className='space-y-3'>
          <p>{t('errors.unavailable')}</p>
          <button className='min-h-11 rounded-md border border-border px-4' onClick={() => void query.refetch()}>
            {t('retry')}
          </button>
        </div>
      )}
      {!query.isPending && !query.isError && !user && <p>{t('empty')}</p>}
      {user && (
        <div className='grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]'>
          <section className='space-y-5 rounded-lg border border-border bg-surface p-5'>
            <h2 className='text-lg font-semibold'>{t('redesign.profileDetails')}</h2>
            <MyProfileEditor />
            <dl className='grid gap-x-6 gap-y-5 sm:grid-cols-2'>
              {[
                [t('name'), user.employee.fullName],
                [t('email'), user.loginEmail],
                [t('employeeCode'), user.employee.employeeCode],
                [t('department'), user.employee.department?.name],
                [t('jobTitle'), user.employee.jobTitle]
              ].map(([label, value]) => (
                <div key={label} className='min-w-0 border-b border-border/40 pb-4'>
                  <dt className='text-xs text-muted-foreground'>{label}</dt>
                  <dd className='mt-2 break-words text-sm font-medium'>{value ?? t('noValue')}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className='space-y-4 rounded-lg border border-border bg-surface p-5'>
            <h2 className='flex items-center gap-2 text-lg font-semibold'>
              <KeyRound aria-hidden strokeWidth={1.5} className='size-5' />
              {t('redesign.security')}
            </h2>
            <p className='text-sm text-muted-foreground'>{t('redesign.securityHint')}</p>
            <Link
              to='/change-password'
              className='inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-surface-subtle'
            >
              {t('changePassword')}
            </Link>
          </section>
        </div>
      )}
      {user && additionalDetails}
    </div>
  )
}
