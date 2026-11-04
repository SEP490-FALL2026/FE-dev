import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { QueryKey } from '@tanstack/react-query'
import type { SaasIssueResponseDtoData } from '~/shared/api/generated/model/saas-issues/saasIssueResponseDtoData'
import { useSaasIssueTransition } from '~/shared/api/generated/operations/saas-issues/saas-issue-transition'
import { useSaasIssueMarkDuplicate } from '~/shared/api/generated/operations/saas-issues/saas-issue-mark-duplicate'
import { ItField, ItFormDialog, itInputClass } from '../../shared/components/it-form'
import { useItMutationFeedback } from '../../shared/hooks/use-it-mutation-feedback'
import { ISSUE_STATE, nextIssueStates } from '../enums/issue-state'

export function IssueTransitionDialog({
  issue,
  mode,
  queryKeys,
  onClose
}: {
  issue: NonNullable<SaasIssueResponseDtoData>
  mode: 'transition' | 'duplicate'
  queryKeys: readonly QueryKey[]
  onClose: () => void
}) {
  const { t: translate } = useTranslation('itIssues')
  const states = nextIssueStates(issue.state)
  const [to, setTo] = useState(states[0] ?? ISSUE_STATE.IN_PROGRESS)
  const [text, setText] = useState('')
  const [vendorTicketRef, setVendorTicketRef] = useState('')
  const [originalId, setOriginalId] = useState('')
  const feedback = useItMutationFeedback(queryKeys, onClose)
  const transition = useSaasIssueTransition({ mutation: feedback })
  const duplicate = useSaasIssueMarkDuplicate({ mutation: feedback })
  return (
    <ItFormDialog
      title={translate(mode === 'duplicate' ? 'duplicate' : 'transition')}
      pending={transition.isPending || duplicate.isPending}
      onClose={onClose}
      submitLabel={translate('save')}
      onSubmit={(event) => {
        event.preventDefault()
        if (transition.isPending || duplicate.isPending) return
        if (mode === 'duplicate') {
          if (text.trim() && originalId.trim())
            duplicate.mutate({ id: issue.id, data: { ofIssueId: originalId.trim(), reason: text.trim() } })
          return
        }
        if (
          !states.includes(to) ||
          ((to === ISSUE_STATE.WAITING_REPORTER || to === ISSUE_STATE.RESOLVED) && !text.trim())
        )
          return
        transition.mutate({
          id: issue.id,
          data: {
            to,
            ...(text.trim()
              ? to === ISSUE_STATE.RESOLVED
                ? { resolution: text.trim() }
                : { message: text.trim() }
              : {}),
            ...(vendorTicketRef.trim() ? { vendorTicketRef: vendorTicketRef.trim() } : {})
          }
        })
      }}
    >
      {mode === 'duplicate' ? (
        <ItField label={translate('duplicateId')}>
          <input
            required
            className={itInputClass}
            pattern='[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'
            placeholder={translate('duplicatePlaceholder')}
            value={originalId}
            onChange={(event) => setOriginalId(event.target.value)}
          />
        </ItField>
      ) : (
        <ItChoiceSelect
          label={translate('state')}
          value={to}
          options={states.map((value) => ({ value, label: translate(`states.${value}`) }))}
          onChange={(value) => {
            const next = states.find((state) => state === value)
            if (next) setTo(next)
          }}
        />
      )}
      <ItField
        label={translate(mode === 'duplicate' ? 'reason' : to === ISSUE_STATE.RESOLVED ? 'resolution' : 'message')}
      >
        <textarea
          required={mode === 'duplicate' || to === ISSUE_STATE.RESOLVED || to === ISSUE_STATE.WAITING_REPORTER}
          maxLength={mode === 'duplicate' ? 1000 : 2000}
          className={itInputClass}
          placeholder={translate(
            mode === 'duplicate'
              ? 'reasonPlaceholder'
              : to === ISSUE_STATE.RESOLVED
                ? 'resolutionPlaceholder'
                : 'messagePlaceholder'
          )}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </ItField>
      {mode === 'transition' && to === ISSUE_STATE.WAITING_PROVIDER && (
        <ItField label={translate('vendorTicket')}>
          <input
            maxLength={100}
            className={itInputClass}
            placeholder={translate('ticketPlaceholder')}
            value={vendorTicketRef}
            onChange={(event) => setVendorTicketRef(event.target.value)}
          />
        </ItField>
      )}
      <p className='text-xs text-muted-foreground'>{translate('secretHint')}</p>
    </ItFormDialog>
  )
}
