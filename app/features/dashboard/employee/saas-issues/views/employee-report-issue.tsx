import { useState } from 'react'
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
  const { page, pageSize, onPage } = useEmployeePage()
  const options = useSaasIssueFormOptions({ page, pageSize })
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
      <EmployeeButton onClick={onBack}>{translate('back')}</EmployeeButton>
      <h1 className='text-2xl font-semibold'>{translate('reportIssue')}</h1>
      <EmployeeSection title={translate('reportIssue')}>
        <p className='max-w-3xl text-sm text-muted-foreground'>{translate('issueHint')}</p>
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
              <legend className='mb-3 text-sm font-medium'>{translate('chooseAssignment')}</legend>
              <EmployeeQueryState query={options} empty={!options.data?.data?.items.length} />
              {!options.isError && (
                <div className='grid gap-2 sm:grid-cols-2'>
                  {options.data?.data?.items.map((assignment) => (
                    <label
                      key={assignment.assignmentId}
                      className='flex min-h-11 min-w-0 items-center gap-3 rounded-md border border-border/60 p-3'
                    >
                      <input
                        required
                        type='radio'
                        name='assignment'
                        value={assignment.assignmentId}
                        checked={assignmentId === assignment.assignmentId}
                        onChange={() => setAssignmentId(assignment.assignmentId)}
                      />
                      <span className='truncate text-sm' title={assignment.plan.applicationName}>
                        {assignment.plan.applicationName} · {assignment.plan.planName}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <EmployeePagination
                pagination={options.data?.data?.pagination}
                busy={options.isFetching}
                onPage={(next) => {
                  setAssignmentId('')
                  onPage(next)
                }}
              />
              <div className='grid gap-5 sm:grid-cols-2'>
                <EmployeeField label={translate('category')}>
                  <select
                    className={employeeInputClass}
                    value={category}
                    onChange={(event) => {
                      const next = Object.values(ISSUE_CATEGORY).find((value) => value === event.target.value)
                      if (next) setCategory(next)
                    }}
                  >
                    {Object.values(ISSUE_CATEGORY).map((value) => (
                      <option value={value} key={value}>
                        {translate(`statuses.${value}`)}
                      </option>
                    ))}
                  </select>
                </EmployeeField>
                <EmployeeField label={translate('impact')}>
                  <select
                    className={employeeInputClass}
                    value={impact}
                    onChange={(event) => {
                      const next = Object.values(ISSUE_IMPACT).find((value) => value === event.target.value)
                      if (next) setImpact(next)
                    }}
                  >
                    {Object.values(ISSUE_IMPACT).map((value) => (
                      <option value={value} key={value}>
                        {translate(`statuses.${value}`)}
                      </option>
                    ))}
                  </select>
                </EmployeeField>
                <EmployeeField label={translate('occurredAt')}>
                  <EmployeeInput required type='datetime-local' name='occurredAt' />
                </EmployeeField>
              </div>
              <EmployeeField label={translate('description')}>
                <textarea
                  className={employeeInputClass}
                  required
                  name='description'
                  maxLength={options.data?.data?.descriptionMaxLength ?? 2000}
                  rows={4}
                />
              </EmployeeField>
            </fieldset>
            {feedback.unknownOutcome && (
              <p role='status' className='text-sm text-warning'>
                {translate('errors.unknownOutcome')}
              </p>
            )}
            <div className='flex justify-end border-t border-border/60 pt-5'>
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
