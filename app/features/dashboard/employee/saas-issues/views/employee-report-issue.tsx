import { useState } from 'react'
import { ArrowLeft, Bug, MessageSquareWarning } from 'lucide-react'
import { EmployeeFormStep } from '../../shared/components/employee-layout'
import { EmployeeSelect } from '../../shared/components/employee-select'
import { EmployeePageHeader } from '../../shared/components/employee-page-header'
import { useTranslation } from 'react-i18next'
import { useSaasIssueFormOptions } from '~/shared/api/generated/operations/saas-issues/saas-issue-form-options'
import { useSaasIssueSubmit } from '~/shared/api/generated/operations/saas-issues/saas-issue-submit'
import { getSaasIssueListQueryKey } from '~/shared/api/generated/operations/saas-issues/saas-issue-list'
import type { SubmitSaasIssueBodyDtoCategory, SubmitSaasIssueBodyDtoImpact } from '~/shared/api/generated/model'
import {
  EmployeeFormErrors,
  EmployeeButton,
  EmployeeField,
  EmployeeInput,
  EmployeePagination,
  EmployeeQueryState,
  EmployeeSection,
  employeeInputClass
} from '../../shared/components/employee-api-ui'
import { useEmployeePage } from '../../shared/hooks/use-employee-page'
import { useEmployeeFeedback } from '../../shared/hooks/use-employee-feedback'
import { ISSUE_CATEGORY, ISSUE_IMPACT } from '../enums/issue-status'

export function EmployeeReportIssue({ onCreated, onBack }: { onCreated: (id: string) => void; onBack: () => void }) {
  const { t: translate } = useTranslation('employee')
  const { page, onPage } = useEmployeePage()
  // One large page keeps every assignment searchable in the picker; extra pages stay reachable below it.
  const options = useSaasIssueFormOptions({ page, pageSize: 100 })
  const [assignmentId, setAssignmentId] = useState('')
  const [category, setCategory] = useState<SubmitSaasIssueBodyDtoCategory>(ISSUE_CATEGORY.NO_ACCESS)
  const [impact, setImpact] = useState<SubmitSaasIssueBodyDtoImpact>(ISSUE_IMPACT.UNUSABLE)
  const feedback = useEmployeeFeedback([getSaasIssueListQueryKey()])
  const mutation = useSaasIssueSubmit({
    mutation: {
      ...feedback,
      retry: false,
      onSuccess: async (response) => {
        if (!response.data?.id) {
          feedback.markUnknownOutcome()
          return
        }
        await feedback.onSuccess()
        if (feedback.isActive()) onCreated(response.data.id)
      }
    }
  })
  return (
    <div className='space-y-6'>
      <EmployeePageHeader
        title={translate('reportIssue')}
        icon={Bug}
        actions={
          <EmployeeButton onClick={onBack}>
            <ArrowLeft aria-hidden strokeWidth={1.5} className='size-4' />
            {translate('back')}
          </EmployeeButton>
        }
      />
      <EmployeeSection title={translate('redesign.requestFields')} icon={MessageSquareWarning}>
        <form
          className='space-y-5'
          onSubmit={(event) => {
            event.preventDefault()
            if (mutation.isPending || feedback.blocked || !assignmentId) return
            const fields = new FormData(event.currentTarget)
            mutation.mutate({
              data: {
                assignmentId,
                category,
                impact,
                description: String(fields.get('description')).trim(),
                occurredAt: new Date(String(fields.get('occurredAt'))).toISOString()
              }
            })
          }}
        >
          <EmployeeFormErrors fields={feedback.invalidFields}>
            <fieldset disabled={mutation.isPending || feedback.blocked} className='space-y-5'>
              <EmployeeFormStep step={1} title={translate('ui.issues.softwareStep')}>
                <EmployeeField label={translate('chooseAssignment')}>
                  <EmployeeSelect
                    required
                    name='assignment'
                    value={assignmentId}
                    placeholder={translate('ui.placeholders.issueAssignment')}
                    loading={options.isFetching}
                    emptyText={translate('redesign.noAssignments')}
                    options={
                      options.isError
                        ? []
                        : (options.data?.data?.items ?? []).map((assignment) => ({
                            value: assignment.assignmentId,
                            label: assignment.plan.applicationName,
                            description: assignment.plan.planName
                          }))
                    }
                    onChange={setAssignmentId}
                  />
                </EmployeeField>
                {(options.isError || (options.isSuccess && !options.data?.data?.items.length)) && (
                  <EmployeeQueryState
                    query={options}
                    empty={!options.data?.data?.items.length}
                    emptyTitle={translate('redesign.noAssignments')}
                    emptyDescription={translate('redesign.noAssignmentsHint')}
                  />
                )}
                <EmployeePagination
                  pagination={options.data?.data?.pagination}
                  busy={options.isFetching}
                  onPage={(next) => {
                    setAssignmentId('')
                    onPage(next)
                  }}
                />
              </EmployeeFormStep>
              <EmployeeFormStep step={2} title={translate('ui.issues.detailsStep')}>
                <div className='grid items-start gap-5 sm:grid-cols-2'>
                  <EmployeeField label={translate('category')}>
                    <EmployeeSelect
                      required
                      value={category}
                      placeholder={translate('ui.placeholders.issueCategory')}
                      options={Object.values(ISSUE_CATEGORY).map((value) => ({
                        value,
                        label: translate(`statuses.${value}`)
                      }))}
                      onChange={(value) => {
                        const next = Object.values(ISSUE_CATEGORY).find((option) => option === value)
                        if (next) setCategory(next)
                      }}
                    />
                  </EmployeeField>
                  <EmployeeField label={translate('impact')}>
                    <EmployeeSelect
                      required
                      value={impact}
                      placeholder={translate('ui.placeholders.issueImpact')}
                      options={Object.values(ISSUE_IMPACT).map((value) => ({
                        value,
                        label: translate(`statuses.${value}`)
                      }))}
                      onChange={(value) => {
                        const next = Object.values(ISSUE_IMPACT).find((option) => option === value)
                        if (next) setImpact(next)
                      }}
                    />
                  </EmployeeField>
                  <EmployeeField label={translate('occurredAt')}>
                    <EmployeeInput required type='datetime-local' name='occurredAt' />
                  </EmployeeField>
                </div>
                <p role='note' className='soft-panel p-3 text-sm leading-relaxed text-muted-foreground'>
                  {translate('issueHint')}
                </p>
                <EmployeeField label={translate('description')}>
                  <textarea
                    className={employeeInputClass}
                    required
                    name='description'
                    maxLength={options.data?.data?.descriptionMaxLength ?? 2000}
                    rows={4}
                    placeholder={translate('ui.placeholders.issueDescription')}
                  />
                </EmployeeField>
              </EmployeeFormStep>
            </fieldset>
            {feedback.unknownOutcome && (
              <p role='status' className='text-sm text-warning'>
                {translate('errors.unknownOutcome')}
              </p>
            )}
            <div className='sticky bottom-0 flex justify-end border-t border-border/60 bg-surface pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
              <EmployeeButton
                primary
                type='submit'
                busy={mutation.isPending}
                disabled={!assignmentId || options.isError || feedback.blocked}
              >
                {feedback.retrySeconds
                  ? translate('retryAfter', { seconds: feedback.retrySeconds })
                  : translate('reportIssue')}
              </EmployeeButton>
            </div>
          </EmployeeFormErrors>
        </form>
      </EmployeeSection>
    </div>
  )
}
