import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSaasIssueList } from '~/shared/api/generated/operations/saas-issues/saas-issue-list'
import { ItChoiceSelect } from '../../shared/components/it-choice-select'
import { useAccumulatedOptions } from '../../shared/hooks/use-accumulated-options'

const PAGE_SIZE = 50

/** Lists issues of the same department by code and title so the original is chosen, not typed. */
export function IssueOriginalPicker({
  issueId,
  departmentId,
  value,
  onChange
}: {
  issueId: string
  departmentId?: string
  value: string
  onChange: (id: string) => void
}) {
  const { t: translate } = useTranslation('itIssues')
  const [page, setPage] = useState(1)
  const query = useSaasIssueList({ scope: 'all', departmentId, page, pageSize: PAGE_SIZE })
  const totalItems = query.data?.data?.pagination.totalItems ?? 0
  const options = useAccumulatedOptions({
    page,
    items: query.data?.data?.items,
    resetKey: departmentId ?? '',
    onReset: () => setPage(1),
    toOption: (item) =>
      item.id === issueId || item.state === 'DUPLICATE'
        ? null
        : { value: item.id, label: item.title, description: item.code }
  })
  return (
    <ItChoiceSelect
      label={translate('duplicateId')}
      hint={translate('fieldHints.duplicateId')}
      placeholder={translate('duplicatePlaceholder')}
      required
      value={value}
      options={options}
      loading={query.isFetching}
      disabled={query.isError}
      hasMore={page * PAGE_SIZE < totalItems}
      onLoadMore={() => setPage((current) => current + 1)}
      onChange={onChange}
    />
  )
}
