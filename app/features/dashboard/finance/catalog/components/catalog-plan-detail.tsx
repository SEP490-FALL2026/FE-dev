import { useTranslation } from 'react-i18next'
import { usePlanGet } from '~/shared/api/generated/operations/plans'
import { usePlanTermsGet } from '~/shared/api/generated/operations/plan-terms'
import { FinanceButton, FinanceDrawer, FinanceQueryState, FinanceSection } from '../../shared/components/finance-ui'
import { formatDay } from '../../shared/finance-date'
import { CatalogFacts } from './catalog-facts'

/** One plan, read only: how it is provisioned and priced, and the terms IT Admin recorded for it. */
export function CatalogPlanDetail({
  planId,
  name,
  onShowSubscriptions,
  onClose
}: {
  planId: string
  name: string
  onShowSubscriptions: () => void
  onClose: () => void
}) {
  const { t: translate, i18n } = useTranslation('financeSettings')
  const plan = usePlanGet(planId)
  const terms = usePlanTermsGet(planId)
  const detail = plan.data?.data
  const termsData = terms.data?.data
  const none = translate('unavailable')
  const yesNo = (value: boolean) => translate(value ? 'yes' : 'no')
  const enumLabel = (value?: string | null) => (value ? translate(`enum.${value}`, { defaultValue: none }) : none)
  const text = (value?: string | null) => value || none

  return (
    <FinanceDrawer title={detail?.name ?? name} onClose={onClose}>
      <FinanceQueryState query={plan}>
        {detail && (
          <FinanceSection
            title={translate('overview')}
            actions={
              <FinanceButton variant='secondary' onClick={onShowSubscriptions}>
                {translate('catalogDetail.viewSubscriptions')}
              </FinanceButton>
            }
          >
            <CatalogFacts
              rows={[
                [translate('application'), detail.applicationName],
                [translate('provisioningType'), enumLabel(detail.provisioningType)],
                [translate('pricingModel'), enumLabel(detail.pricingModel)],
                [translate('catalogDetail.controlLevel'), enumLabel(detail.controlLevel)],
                [translate('catalogDetail.sharingPolicy'), enumLabel(detail.sharingPolicy)],
                [translate('catalogDetail.dataLossOnRemoval'), yesNo(detail.dataLossOnRemoval)],
                [translate('catalogDetail.hasAdminConsole'), yesNo(detail.hasAdminConsole)]
              ]}
            />
          </FinanceSection>
        )}
      </FinanceQueryState>
      <FinanceSection title={translate('catalogDetail.terms')}>
        <FinanceQueryState query={terms}>
          {termsData && !termsData.applicable ? (
            <p className='text-sm text-muted-foreground'>{translate('catalogDetail.termsNotApplicable')}</p>
          ) : termsData?.terms ? (
            <CatalogFacts
              rows={[
                [translate('catalogDetail.lastReviewedOn'), formatDay(termsData.terms.lastReviewedOn, i18n.language)],
                [translate('catalogDetail.aiTraining'), text(termsData.terms.aiTraining)],
                [translate('catalogDetail.dataLocation'), text(termsData.terms.dataLocation)],
                [translate('catalogDetail.commercialUse'), text(termsData.terms.commercialUse)],
                [translate('catalogDetail.cancellationRefund'), text(termsData.terms.cancellationRefund)],
                [
                  translate('catalogDetail.installLimit'),
                  termsData.terms.installLimit?.maxDevicesPerKey ?? termsData.terms.installLimit?.note ?? none
                ],
                [
                  translate('catalogDetail.termsUrl'),
                  termsData.terms.termsUrl && /^https?:\/\//.test(termsData.terms.termsUrl) ? (
                    <a
                      className='text-primary-ink underline underline-offset-2'
                      href={termsData.terms.termsUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {translate('catalogDetail.openTerms')}
                    </a>
                  ) : (
                    none
                  )
                ]
              ]}
            />
          ) : (
            <p className='text-sm text-muted-foreground'>{translate('catalogDetail.noTerms')}</p>
          )}
          {termsData && termsData.warnings.length > 0 && (
            <p role='status' className='text-sm text-warning-ink'>
              {translate('catalogDetail.termsReviewDue')}
            </p>
          )}
        </FinanceQueryState>
      </FinanceSection>
    </FinanceDrawer>
  )
}
