import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Globe,
  Laptop,
  Lock,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Unlock
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { itCollectorDevices, type CollectorDevice } from '../it-admin-data'

export function ItDeviceCollectorsView() {
  const { t } = useTranslation('dashboard')
  const [selectedDevice, setSelectedDevice] = useState<CollectorDevice>(itCollectorDevices[0])

  const metricValues = {
    confirmed: 21,
    pending: 2,
    registered: 24,
    rejected: 1
  }

  const allowlistDomains = [
    { domain: 'github.com', minMinutes: 15 },
    { domain: 'figma.com', minMinutes: 10 },
    { domain: 'atlassian.net', minMinutes: 5 },
    { domain: 'notion.so', minMinutes: 15 }
  ]

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <span className='size-2 rounded-full bg-primary' />
            {t('itAdmin.deviceCollectors.badgeScreenCode')}
          </div>
          <h1 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('itAdmin.deviceCollectors.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('itAdmin.deviceCollectors.subtitle')}</p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
            type='button'
          >
            <Plus aria-hidden='true' className='size-4' />
            <span>{t('itAdmin.deviceCollectors.actRegister')}</span>
          </button>
        </div>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <Laptop aria-hidden='true' className='size-4 text-primary' />
            <span>{t('itAdmin.deviceCollectors.metricRegistered')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.registered}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <CheckCircle2 aria-hidden='true' className='size-4 text-success' />
            <span>{t('itAdmin.deviceCollectors.metricConfirmed')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.confirmed}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <Clock aria-hidden='true' className='size-4 text-warning' />
            <span>{t('itAdmin.deviceCollectors.metricPendingConfirm')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.pending}</p>
        </div>
        <div className='rounded-xl border border-border bg-surface p-4 shadow-sm'>
          <div className='flex items-center gap-2 text-xs font-semibold text-muted-foreground'>
            <AlertTriangle aria-hidden='true' className='size-4 text-danger' />
            <span>{t('itAdmin.deviceCollectors.metricRejected')}</span>
          </div>
          <p className='mt-2 text-2xl font-bold text-foreground'>{metricValues.rejected}</p>
        </div>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-start gap-3'>
            <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-success/10 text-success'>
              <ShieldCheck aria-hidden='true' className='size-5' />
            </span>
            <div>
              <h2 className='text-sm font-bold text-foreground'>{t('itAdmin.deviceCollectors.privacyRuleTitle')}</h2>
              <p className='mt-1 text-xs text-muted-foreground'>{t('itAdmin.deviceCollectors.privacyRuleDesc')}</p>
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-start gap-3'>
            <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-danger/10 text-danger'>
              <ShieldAlert aria-hidden='true' className='size-5' />
            </span>
            <div>
              <h2 className='text-sm font-bold text-foreground'>{t('itAdmin.deviceCollectors.blockedAppsTitle')}</h2>
              <p className='mt-1 text-xs text-muted-foreground'>{t('itAdmin.deviceCollectors.blockedAppsDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
        <div className='flex items-center gap-2 border-b border-border pb-3'>
          <Globe aria-hidden='true' className='size-5 text-primary' />
          <div>
            <h2 className='text-sm font-bold text-foreground'>{t('itAdmin.deviceCollectors.allowlistTitle')}</h2>
            <p className='text-xs text-muted-foreground'>{t('itAdmin.deviceCollectors.allowlistDesc')}</p>
          </div>
        </div>

        <div className='mt-4 flex flex-wrap gap-2.5'>
          {allowlistDomains.map((item) => (
            <div
              className='flex items-center gap-2 rounded-xl border border-border bg-surface-subtle/60 px-3.5 py-2'
              key={item.domain}
            >
              <span className='size-2 rounded-full bg-success' />
              <span className='font-mono text-xs font-bold text-foreground'>{item.domain}</span>
              <span className='text-[0.68rem] text-muted-foreground'>
                ≥ {item.minMinutes} {t('itAdmin.licenseOptimization.daysUnit')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1fr_22rem]'>
        <div className='rounded-2xl border border-border bg-surface shadow-sm'>
          <div className='flex items-center justify-between border-b border-border p-4'>
            <div>
              <h2 className='text-base font-bold text-foreground'>{t('itAdmin.deviceCollectors.metricRegistered')}</h2>
              <p className='text-xs text-muted-foreground'>{t('itAdmin.deviceCollectors.subtitle')}</p>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='border-b border-border bg-surface-subtle text-muted-foreground'>
                <tr>
                  <th className='p-3 font-semibold'>{t('itAdmin.deviceCollectors.colDevice')}</th>
                  <th className='p-3 font-semibold'>{t('itAdmin.deviceCollectors.colEmployee')}</th>
                  <th className='p-3 font-semibold'>{t('itAdmin.deviceCollectors.colDepartment')}</th>
                  <th className='p-3 font-semibold'>{t('itAdmin.deviceCollectors.colDeviceModel')}</th>
                  <th className='p-3 font-semibold'>{t('itAdmin.deviceCollectors.colGateway')}</th>
                  <th className='p-3 font-semibold text-right'>{t('itAdmin.provisioning.colActions')}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {itCollectorDevices.map((device) => {
                  const isSelected = selectedDevice.id === device.id
                  const isOpen = device.gateway === 'open'

                  return (
                    <tr
                      className={`cursor-pointer transition hover:bg-surface-subtle/60 ${
                        isSelected ? 'bg-primary-soft/30' : ''
                      }`}
                      key={device.id}
                      onClick={() => setSelectedDevice(device)}
                    >
                      <td className='p-3 font-mono font-bold text-primary'>{device.id}</td>
                      <td className='p-3 font-semibold text-foreground'>{device.employee}</td>
                      <td className='p-3 text-muted-foreground'>{device.department}</td>
                      <td className='p-3 text-muted-foreground'>{device.device}</td>
                      <td className='p-3'>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${
                            isOpen
                              ? 'border-success/25 bg-success/10 text-success'
                              : 'border-warning/30 bg-warning/15 text-warning'
                          }`}
                        >
                          {isOpen ? (
                            <Unlock aria-hidden='true' className='size-3' />
                          ) : (
                            <Lock aria-hidden='true' className='size-3' />
                          )}
                          <span>
                            {isOpen
                              ? t('itAdmin.deviceCollectors.gatewayOpen')
                              : t('itAdmin.deviceCollectors.gatewayLocked')}
                          </span>
                        </span>
                      </td>
                      <td className='p-3 text-right'>
                        <button
                          className='inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:border-primary hover:text-primary'
                          type='button'
                        >
                          <span>{t('itAdmin.deviceCollectors.actInspect')}</span>
                          <ArrowUpRight aria-hidden='true' className='size-3' />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className='rounded-2xl border border-border bg-surface p-5 shadow-sm'>
          <div className='flex items-center justify-between border-b border-border pb-3'>
            <div>
              <span className='font-mono text-xs font-bold text-primary'>{selectedDevice.id}</span>
              <h2 className='text-base font-bold text-foreground'>{selectedDevice.device}</h2>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${
                selectedDevice.gateway === 'open'
                  ? 'border-success/25 bg-success/10 text-success'
                  : 'border-warning/30 bg-warning/15 text-warning'
              }`}
            >
              {selectedDevice.gateway === 'open' ? (
                <Unlock aria-hidden='true' className='size-3' />
              ) : (
                <Lock aria-hidden='true' className='size-3' />
              )}
              <span>
                {selectedDevice.gateway === 'open'
                  ? t('itAdmin.deviceCollectors.gatewayOpen')
                  : t('itAdmin.deviceCollectors.gatewayLocked')}
              </span>
            </span>
          </div>

          <div className='mt-4 space-y-3 text-xs'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.deviceCollectors.colEmployee')}:</span>
              <span className='font-semibold text-foreground'>{selectedDevice.employee}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.deviceCollectors.colDepartment')}:</span>
              <span className='font-semibold text-foreground'>{selectedDevice.department}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.deviceCollectors.colNoticeVer')}:</span>
              <span className='font-mono font-semibold text-foreground'>{selectedDevice.version}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>{t('itAdmin.deviceCollectors.colLastSync')}:</span>
              <span className='text-muted-foreground'>{selectedDevice.lastSync}</span>
            </div>
          </div>

          <div className='mt-6 border-t border-border pt-4'>
            <div className='rounded-xl border border-primary/20 bg-primary-soft/40 p-3'>
              <div className='flex items-start gap-2'>
                <ShieldCheck aria-hidden='true' className='mt-0.5 size-4 text-primary shrink-0' />
                <p className='text-xs text-muted-foreground'>{t('itAdmin.deviceCollectors.privacyRuleDesc')}</p>
              </div>
            </div>

            <div className='mt-4 flex gap-2'>
              <button
                className='flex-1 rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover'
                type='button'
              >
                {t('itAdmin.deviceCollectors.actInspect')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
