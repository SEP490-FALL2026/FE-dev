import { CreditCard, EyeOff, KeyRound, Laptop, PlusCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itShadowFindings, type ShadowFinding } from '../it-admin-data'

export function ItShadowItView() {
  const { t } = useTranslation('dashboard')
  const [selectedFinding, setSelectedFinding] = useState<ShadowFinding>(itShadowFindings[0])

  const riskConfig: Record<ShadowFinding['risk'], { label: string; tone: string }> = {
    high: {
      label: t('itAdmin.shadowIt.riskHigh'),
      tone: 'bg-danger/10 text-danger border-danger/25'
    },
    low: {
      label: t('itAdmin.shadowIt.riskLow'),
      tone: 'bg-success/10 text-success border-success/25'
    },
    medium: {
      label: t('itAdmin.shadowIt.riskMedium'),
      tone: 'bg-warning/15 text-warning border-warning/30'
    }
  }

  const channels = [
    {
      count: 1,
      icon: CreditCard,
      id: 'finance',
      title: t('itAdmin.shadowIt.channelFinance')
    },
    {
      count: 1,
      icon: KeyRound,
      id: 'idp',
      title: t('itAdmin.shadowIt.channelIdp')
    },
    {
      count: 1,
      icon: Laptop,
      id: 'collector',
      title: t('itAdmin.shadowIt.channelCollector')
    }
  ]

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.shadowIt.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.shadowIt.subtitle')}</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-3'>
        {channels.map((ch) => {
          const Icon = ch.icon

          return (
            <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm' key={ch.id}>
              <div className='flex items-center justify-between'>
                <span className='grid size-9 place-items-center rounded-xl bg-surface-subtle text-foreground'>
                  <Icon aria-hidden='true' className='size-4' />
                </span>
                <span className='rounded-full border border-danger/25 bg-danger/10 px-2.5 py-0.5 text-xs font-bold text-danger'>
                  {ch.count}
                </span>
              </div>
              <h2 className='mt-3 text-xs font-bold text-foreground'>{ch.title}</h2>
            </div>
          )
        })}
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.6fr_1fr]'>
        <div className='overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm'>
          <table className='w-full text-left text-xs'>
            <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
              <tr>
                <th className='p-3 font-semibold'>{t('itAdmin.shadowIt.colFinding')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.shadowIt.colApp')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.shadowIt.colSource')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.shadowIt.colUsers')}</th>
                <th className='p-3 font-semibold'>{t('itAdmin.shadowIt.colRisk')}</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {itShadowFindings.map((finding) => {
                const isSelected = selectedFinding.id === finding.id
                const rCfg = riskConfig[finding.risk]

                return (
                  <tr
                    className={`cursor-pointer transition hover:bg-surface-subtle/80 ${
                      isSelected ? 'bg-primary-soft/30' : ''
                    }`}
                    key={finding.id}
                    onClick={() => setSelectedFinding(finding)}
                  >
                    <td className='p-3 font-mono font-bold text-foreground'>{finding.id}</td>
                    <td className='p-3 font-bold text-foreground'>{finding.app}</td>
                    <td className='p-3 text-muted-foreground'>{finding.source}</td>
                    <td className='p-3 font-semibold text-foreground'>{finding.users}</td>
                    <td className='p-3'>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${rCfg.tone}`}
                      >
                        {rCfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-center justify-between border-b border-border pb-3'>
            <div>
              <span className='text-xs font-mono font-bold text-primary'>{selectedFinding.id}</span>
              <h2 className='text-base font-bold text-foreground'>{selectedFinding.app}</h2>
            </div>
            <span
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                riskConfig[selectedFinding.risk].tone
              }`}
            >
              {riskConfig[selectedFinding.risk].label}
            </span>
          </div>

          <div className='mt-4 space-y-3 text-xs'>
            <div>
              <span className='text-muted-foreground block'>{t('itAdmin.shadowIt.colSource')}:</span>
              <span className='font-semibold text-foreground'>{selectedFinding.source}</span>
            </div>
            <div>
              <span className='text-muted-foreground block'>{t('itAdmin.shadowIt.colContext')}:</span>
              <span className='italic text-foreground'>{selectedFinding.context}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.shadowIt.colUsers')}:</span>
              <span className='font-bold text-foreground'>{selectedFinding.users}</span>
            </div>
          </div>

          <div className='mt-6 border-t border-border pt-4 space-y-2'>
            <span className='block text-xs font-bold text-muted-foreground'>{t('itAdmin.shadowIt.colDecisions')}</span>

            <div className='flex flex-col gap-2'>
              <button
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
                type='button'
              >
                <PlusCircle aria-hidden='true' className='size-3.5' />
                <span>{t('itAdmin.shadowIt.actRegularize')}</span>
              </button>

              <div className='grid grid-cols-2 gap-2'>
                <button
                  className='inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2 text-xs font-semibold hover:border-warning hover:text-warning'
                  type='button'
                >
                  <EyeOff aria-hidden='true' className='size-3.5' />
                  <span>{t('itAdmin.shadowIt.actFalsePositive')}</span>
                </button>
                <button
                  className='inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2 text-xs font-semibold hover:border-danger hover:text-danger'
                  type='button'
                >
                  <Trash2 aria-hidden='true' className='size-3.5' />
                  <span>{t('itAdmin.shadowIt.actDeprovision')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
