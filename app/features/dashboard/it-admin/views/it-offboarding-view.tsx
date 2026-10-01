import { Calendar, CheckCircle2, Clock, FileCheck, UserMinus, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ItOffboardingView() {
  const { t } = useTranslation('dashboard')

  const employee = {
    code: 'NV-0174',
    department: 'Product Team',
    email: 'tran.minh@company.com',
    lastDay: '31/01/2025',
    licenses: ['Figma Professional', 'Google Workspace', 'GitHub Business', 'Slack Business+', 'Notion Team'],
    name: 'Trần Minh',
    planCode: 'OFF-2026-044',
    role: 'Product Designer',
    successor: 'Đỗ Hoàng Long (NV-0082)'
  }

  const stages = [
    {
      badge: t('itAdmin.offboarding.badgeCompleted'),
      desc: t('itAdmin.offboarding.stage1Desc'),
      icon: CheckCircle2,
      id: 1,
      status: 'completed',
      title: t('itAdmin.offboarding.stage1Title'),
      tone: 'bg-success/10 text-success border-success/25'
    },
    {
      badge: t('itAdmin.offboarding.badgePendingProof'),
      desc: t('itAdmin.offboarding.stage2Desc'),
      icon: Clock,
      id: 2,
      status: 'pending',
      title: t('itAdmin.offboarding.stage2Title'),
      tone: 'bg-warning/15 text-warning border-warning/30'
    },
    {
      badge: t('itAdmin.offboarding.badgeScheduled'),
      desc: t('itAdmin.offboarding.stage3Desc'),
      icon: Calendar,
      id: 3,
      status: 'scheduled',
      title: t('itAdmin.offboarding.stage3Title'),
      tone: 'bg-info/10 text-info border-info/25'
    }
  ]

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.offboarding.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.offboarding.subtitle')}</p>
      </div>

      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border pb-5'>
          <div className='flex items-start gap-4'>
            <span className='grid size-12 place-items-center rounded-2xl bg-danger/10 text-danger border border-danger/20'>
              <UserMinus aria-hidden='true' className='size-6' />
            </span>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-bold text-foreground'>{employee.name}</h2>
                <span className='rounded-md border border-border bg-surface-subtle px-2 py-0.5 text-xs font-mono font-semibold text-muted-foreground'>
                  {employee.code}
                </span>
              </div>
              <p className='mt-0.5 text-xs text-muted-foreground'>
                {employee.role} · {employee.department}
              </p>
              <p className='text-xs font-mono text-muted-foreground'>{employee.email}</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2 text-xs'>
            <div className='rounded-xl border border-border bg-surface-subtle p-3'>
              <span className='text-muted-foreground block text-[0.7rem]'>{t('itAdmin.offboarding.planCode')}</span>
              <span className='font-mono font-bold text-foreground'>{employee.planCode}</span>
            </div>
            <div className='rounded-xl border border-border bg-surface-subtle p-3'>
              <span className='text-muted-foreground block text-[0.7rem]'>{t('itAdmin.offboarding.lastDay')}</span>
              <span className='font-bold text-foreground'>{employee.lastDay}</span>
            </div>
            <div className='rounded-xl border border-border bg-surface-subtle p-3'>
              <span className='text-muted-foreground block text-[0.7rem]'>{t('itAdmin.offboarding.seatsHeld')}</span>
              <span className='font-bold text-danger'>{employee.licenses.length}</span>
            </div>
          </div>
        </div>

        <div className='mt-4 grid gap-4 sm:grid-cols-2'>
          <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
            <span className='text-xs font-semibold text-muted-foreground block'>
              {t('itAdmin.offboarding.successors')}
            </span>
            <div className='mt-2 flex items-center gap-2'>
              <Users aria-hidden='true' className='size-4 text-primary' />
              <span className='text-xs font-semibold text-foreground'>{employee.successor}</span>
            </div>
          </div>

          <div className='rounded-xl border border-border bg-surface-subtle/50 p-4'>
            <span className='text-xs font-semibold text-muted-foreground block'>
              {t('itAdmin.offboarding.seatsHeld')}
            </span>
            <div className='mt-2 flex flex-wrap gap-1.5'>
              {employee.licenses.map((lic) => (
                <span
                  className='rounded-md border border-border bg-surface px-2 py-0.5 text-[0.7rem] font-medium text-foreground'
                  key={lic}
                >
                  {lic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        {stages.map((stage) => {
          const Icon = stage.icon

          return (
            <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm' key={stage.id}>
              <div className='flex items-center justify-between'>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${stage.tone}`}>
                  {stage.badge}
                </span>
                <span className='grid size-7 place-items-center rounded-lg bg-surface-subtle text-muted-foreground'>
                  <Icon aria-hidden='true' className='size-4' />
                </span>
              </div>
              <h2 className='mt-3 text-sm font-bold text-foreground'>{stage.title}</h2>
              <p className='mt-1 text-xs text-muted-foreground'>{stage.desc}</p>

              <div className='mt-4 pt-3 border-t border-border'>
                {stage.id === 1 && (
                  <div className='flex items-center gap-2 text-xs text-success font-medium'>
                    <CheckCircle2 aria-hidden='true' className='size-3.5' />
                    <span>{t('itAdmin.offboarding.badgeCompleted')}</span>
                  </div>
                )}
                {stage.id === 2 && (
                  <button
                    className='inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline'
                    type='button'
                  >
                    <FileCheck aria-hidden='true' className='size-3.5' />
                    <span>{t('itAdmin.provisioning.actEvidence')}</span>
                  </button>
                )}
                {stage.id === 3 && (
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <Clock aria-hidden='true' className='size-3.5' />
                    <span>
                      {30} {t('itAdmin.licenseOptimization.daysUnit')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
