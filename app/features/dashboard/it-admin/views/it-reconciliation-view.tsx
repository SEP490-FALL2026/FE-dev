import { FileSpreadsheet, Scale, ShieldAlert, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { itReconciliationItems } from '../it-admin-data'

export function ItReconciliationView() {
  const { t } = useTranslation('dashboard')

  const comparisonRows = [
    {
      active: 48,
      app: 'Slack Business+',
      billed: 55,
      declared: 50,
      diff: '+5 seat (Billed > Declared)',
      status: 'danger'
    },
    {
      active: 118,
      app: 'GitHub Enterprise',
      billed: 120,
      declared: 120,
      diff: '1 shadow admin',
      status: 'warning'
    },
    {
      active: 45,
      app: 'Figma Organization',
      billed: 45,
      declared: 45,
      diff: '1 pending activated',
      status: 'info'
    },
    {
      active: 280,
      app: 'Google Workspace',
      billed: 300,
      declared: 300,
      diff: 'Khớp hoàn toàn',
      status: 'success'
    }
  ]

  const discrepancyIcons = {
    invoice: FileSpreadsheet,
    pendingAcceptance: UserCheck,
    shadowAccess: ShieldAlert
  }

  const discrepancyActions = {
    invoice: t('itAdmin.reconciliation.actUpdateContract'),
    pendingAcceptance: t('itAdmin.reconciliation.actCompletePending'),
    shadowAccess: t('itAdmin.reconciliation.actInvestigate')
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.reconciliation.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.reconciliation.subtitle')}</p>
      </div>

      <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm'>
        <div className='flex items-center gap-2 border-b border-border pb-3'>
          <Scale aria-hidden='true' className='size-5 text-primary' />
          <div>
            <h2 className='text-base font-bold text-foreground'>{t('itAdmin.reconciliation.threeNumbersTitle')}</h2>
            <p className='text-xs text-muted-foreground'>{t('itAdmin.reconciliation.subtitle')}</p>
          </div>
        </div>

        <div className='mt-4 overflow-x-auto'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>{t('itAdmin.provisioning.colApp')}</th>
                <th className='p-3 font-semibold text-center'>{t('itAdmin.reconciliation.colBilled')}</th>
                <th className='p-3 font-semibold text-center'>{t('itAdmin.reconciliation.colDeclared')}</th>
                <th className='p-3 font-semibold text-center'>{t('itAdmin.reconciliation.colActive')}</th>
                <th className='p-3 font-semibold text-right'>{t('itAdmin.provisioning.colStatus')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border font-mono'>
              {comparisonRows.map((row) => (
                <tr className='transition hover:bg-surface-subtle/60' key={row.app}>
                  <td className='p-3 font-sans font-semibold text-foreground'>{row.app}</td>
                  <td className='p-3 text-center font-bold text-foreground'>{row.billed}</td>
                  <td className='p-3 text-center text-muted-foreground'>{row.declared}</td>
                  <td className='p-3 text-center text-muted-foreground'>{row.active}</td>
                  <td className='p-3 text-right font-sans'>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${
                        row.status === 'danger'
                          ? 'border-danger/25 bg-danger/10 text-danger'
                          : row.status === 'warning'
                            ? 'border-warning/30 bg-warning/15 text-warning'
                            : row.status === 'info'
                              ? 'border-info/25 bg-info/10 text-info'
                              : 'border-success/25 bg-success/10 text-success'
                      }`}
                    >
                      {row.diff}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='space-y-3'>
        <h2 className='text-base font-bold text-foreground'>{t('itAdmin.nav.reconciliation')}</h2>

        <div className='grid gap-4 sm:grid-cols-3'>
          {itReconciliationItems.map((item) => {
            const Icon = discrepancyIcons[item.type]
            const actionLabel = discrepancyActions[item.type]

            return (
              <div
                className='flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm'
                key={item.id}
              >
                <div>
                  <div className='flex items-center justify-between'>
                    <span className='grid size-9 place-items-center rounded-xl bg-surface-subtle text-foreground'>
                      <Icon aria-hidden='true' className='size-4' />
                    </span>
                    <span className='text-xs font-mono font-bold text-primary'>{item.id}</span>
                  </div>
                  <h3 className='mt-3 text-sm font-bold text-foreground'>{item.title}</h3>
                  <p className='mt-1 text-xs text-muted-foreground font-mono'>{item.diff}</p>
                </div>

                <div className='mt-4 pt-3 border-t border-border'>
                  <button
                    className='inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
                    type='button'
                  >
                    <span>{actionLabel}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
