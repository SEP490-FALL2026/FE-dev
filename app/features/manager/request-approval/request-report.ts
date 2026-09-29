import type { TFunction } from 'i18next'

import type { TeamRequest } from '~/entities/request/manager-requests-demo'

import { suppliedRequestDetail } from './request-approval-demo'

export function buildRequestReport(request: TeamRequest, locale: string, t: TFunction) {
  const detail = request.id === suppliedRequestDetail.id ? suppliedRequestDetail : undefined
  const unknown = t('requestApproval.unknown')
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' })
  const dateTime = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
  const number = new Intl.NumberFormat(locale)
  const rows = [
    [t('teamRequests.id'), request.id],
    [t('teamRequests.status'), t(`teamRequests.statuses.${request.status}`)],
    [t('teamRequests.requestedBy'), request.name],
    [t('requestApproval.department'), detail?.department ?? unknown],
    [t('requestApproval.email'), detail?.email ?? unknown],
    [t('requestApproval.employeeId'), detail?.employeeId ?? unknown],
    [t('requestApproval.manager'), detail?.manager ?? unknown],
    [t('teamRequests.software'), request.software],
    [t('teamRequests.plan'), request.plan],
    [t('teamRequests.type'), t(`teamRequests.types.${request.type}`)],
    [t('requestApproval.requestedDate'), dateTime.format(new Date(request.submitted))],
    [t('teamRequests.sla'), t('teamRequests.hoursLeft', { value: number.format(request.hoursLeft) })],
    [t('requestApproval.due'), unknown],
    [t('requestApproval.reason'), detail ? t('requestApproval.sampleReason') : unknown],
    [t('requestApproval.project'), detail?.project ?? unknown],
    [t('requestApproval.requiredFrom'), detail ? date.format(new Date(detail.requiredFrom)) : unknown],
    [t('requestApproval.requiredUntil'), detail ? date.format(new Date(detail.requiredUntil)) : unknown],
    [t('requestApproval.costCenter'), detail ? t('requestApproval.sampleCostCenter') : unknown],
    [
      t('requestApproval.estimatedCost'),
      detail
        ? t('requestApproval.monthly', {
            amount: new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(
              detail.estimatedMonthlyCost
            )
          })
        : unknown
    ],
    [t('requestApproval.additional'), detail ? t('requestApproval.noAdditional') : unknown],
    [t('requestApproval.attachments'), detail ? t('requestApproval.noAttachments') : unknown]
  ]
  return [
    t('requestApproval.exportSample'),
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    detail ? t('requestApproval.dateNote') : t('requestApproval.partial'),
    ...(request.status === 'overdue'
      ? [t('teamRequests.slaMismatch', { value: number.format(request.hoursLeft) })]
      : [])
  ].join('\n')
}
