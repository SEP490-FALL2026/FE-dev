import { useTranslation } from 'react-i18next'
import type { AssessmentPatchDto } from '~/shared/api/generated/model/access-requests/assessmentPatchDto'
import type { AssessmentResponseDtoDataAssessment } from '~/shared/api/generated/model/access-requests/assessmentResponseDtoDataAssessment'
import { ItField, itInputClass } from '../../shared/components/it-form'
import { AssessmentQuote } from './assessment-quote'
import { AssessmentClassification } from '../enums/assessment-classification'

export function AssessmentFields({
  item,
  draft,
  onChange
}: {
  item: AssessmentResponseDtoDataAssessment
  draft: AssessmentPatchDto
  onChange: (draft: AssessmentPatchDto) => void
}) {
  const { t: translate } = useTranslation('itNewSoftware')
  function set<K extends keyof AssessmentPatchDto>(key: K, value: AssessmentPatchDto[K]) {
    onChange({ ...draft, [key]: value })
  }
  return (
    <div className='space-y-4'>
      <p className='text-sm text-muted-foreground'>{translate('patchHint')}</p>
      {(['classification', 'provisioningType', 'controlLevel', 'dataSensitivity'] as const).map((key) => (
        <fieldset key={key} className='space-y-1'>
          <legend className='text-sm font-medium'>{translate(`fields.${key}`)}</legend>
          <div className='flex flex-wrap gap-3'>
            {(key === 'classification'
              ? Object.values(AssessmentClassification)
              : key === 'provisioningType'
                ? ['K1', 'K2', 'K3', 'K4']
                : key === 'controlLevel'
                  ? ['FULL', 'PARTIAL', 'UNCONTROLLABLE']
                  : ['LOW', 'MEDIUM', 'HIGH']
            ).map((value) => (
              <label key={value} className='flex min-h-11 items-center gap-2 text-sm'>
                <input
                  type='radio'
                  name={key}
                  checked={(draft[key] ?? item[key]) === value}
                  onChange={() => set(key, value as AssessmentPatchDto[typeof key])}
                />
                {translate(`values.${value}`, { defaultValue: value })}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {(['adminConsole', 'memberExport', 'sso'] as const).map((key) => (
        <fieldset key={key} className='space-y-1'>
          <legend className='text-sm font-medium'>{translate(`fields.${key}`)}</legend>
          <div className='flex gap-4'>
            {[true, false].map((value) => (
              <label key={String(value)} className='flex min-h-11 items-center gap-2 text-sm'>
                <input
                  type='radio'
                  name={key}
                  checked={(draft[key] ?? item[key]) === value}
                  onChange={() => set(key, value)}
                />
                {translate(value ? 'yes' : 'no')}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <fieldset>
        <legend>{translate('opinion')}</legend>
        <div className='flex flex-wrap gap-3'>
          {(['OBTAINED', 'NOT_AVAILABLE'] as const).map((value) => (
            <label key={value} className='flex min-h-11 items-center gap-2'>
              <input
                type='radio'
                name='opinion'
                checked={(draft.opinion ?? item.opinion)?.status === value}
                onChange={() =>
                  set('opinion', { status: value, note: draft.opinion?.note ?? item.opinion?.note ?? undefined })
                }
              />
              {translate(`values.${value}`)}
            </label>
          ))}
        </div>
        <ItField label={translate('opinionNote')}>
          <input
            className={itInputClass}
            maxLength={1000}
            placeholder={translate('placeholders.opinion')}
            value={(draft.opinion ?? item.opinion)?.note ?? ''}
            onChange={(event) =>
              set('opinion', {
                status: (draft.opinion ?? item.opinion)?.status ?? 'NOT_AVAILABLE',
                note: event.target.value || undefined
              })
            }
          />
        </ItField>
      </fieldset>
      <div className='grid gap-4 sm:grid-cols-2'>
        {(
          [
            'vendorName',
            'plannedPlanName',
            'termsSummary',
            'memberUsageMethod',
            'grantRevokeMethod',
            'controlRiskNote',
            'proposedBusinessOwnerEmployeeId',
            'equivalentPlanId'
          ] as const
        ).map((key) => (
          <ItField key={key} label={translate(`fields.${key}`)}>
            <input
              placeholder={translate(`placeholders.${key}`)}
              className={itInputClass}
              maxLength={key === 'termsSummary' ? 2000 : key === 'vendorName' || key === 'plannedPlanName' ? 200 : 1000}
              value={
                draft[key] ??
                (key === 'vendorName'
                  ? item.vendor.name
                  : key === 'proposedBusinessOwnerEmployeeId'
                    ? item.proposedBusinessOwner?.employeeId
                    : key === 'equivalentPlanId'
                      ? item.equivalentTool?.planId
                      : item[key]) ??
                ''
              }
              onChange={(event) => set(key, event.target.value || undefined)}
            />
          </ItField>
        ))}
      </div>
      <AssessmentQuote
        quote={draft.quote === undefined ? item.quote : draft.quote}
        onChange={(quote) => set('quote', quote)}
      />
    </div>
  )
}
