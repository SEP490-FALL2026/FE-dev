import { useState } from 'react'
import { UsersRound, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDepartmentMemberList } from '~/shared/api/generated/operations/departments'
import { useDashboardFormat } from '../../../dashboard-ui'
import { AdminQueryState, AdminEmpty } from '../../shared/components/admin-query-state'
import { AdminPagination } from '../../shared/components/admin-pagination'
import { MemberStatus } from '../enums/member-status'
import { MemberWorkState } from '../enums/member-work-state'
import { DepartmentSection } from './department-section'

export function DepartmentMembersPanel({ id }: { id: string }) {
  const { t: translate } = useTranslation('adminOrganization')
  const { formatDate } = useDashboardFormat()
  const [page, setPage] = useState(1)
  const members = useDepartmentMemberList(id, { page, pageSize: 20 })
  return (
    <DepartmentSection title={translate('members')} icon={UsersRound}>
      <p className='mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground'>{translate('membersHelp')}</p>
      <AdminQueryState query={members}>
        {!members.data?.data?.items.length && <AdminEmpty />}
        <div className='divide-y divide-border/70'>
          {members.data?.data?.items.map((member) => (
            <article
              key={member.employeeCode}
              className='grid min-w-0 gap-3 py-4 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto]'
            >
              <div className='flex min-w-0 items-start gap-3'>
                <span className='grid size-10 shrink-0 place-items-center rounded-md bg-surface-subtle text-muted-foreground'>
                  <UserRound aria-hidden className='size-5' strokeWidth={1.5} />
                </span>
                <div className='min-w-0'>
                  <h3 className='truncate text-sm font-semibold' title={member.fullName}>
                    {member.fullName}
                  </h3>
                  <p className='mt-1 truncate font-mono text-xs text-muted-foreground' title={member.employeeCode}>
                    {member.employeeCode}
                  </p>
                  <p className='mt-1.5 text-xs text-muted-foreground'>
                    {Object.values(MemberStatus).includes(member.status)
                      ? translate(`memberStatus.${member.status}`)
                      : translate('unknown')}
                    <span aria-hidden> · </span>
                    {Object.values(MemberWorkState).includes(member.workState)
                      ? translate(`workState.${member.workState}`)
                      : translate('unknown')}
                  </p>
                </div>
              </div>
              <div className='text-right text-xs'>
                <p className='text-muted-foreground'>{translate('memberSince')}</p>
                <p className='mt-1 font-mono tabular-nums'>{formatDate(member.memberSince)}</p>
                <p className='mt-1.5 text-muted-foreground'>
                  {translate(member.hasWorkEmail ? 'hasEmail' : 'noEmail')}
                </p>
              </div>
            </article>
          ))}
        </div>
        <AdminPagination
          pagination={members.data?.data?.pagination}
          onPageChange={setPage}
          disabled={members.isFetching}
        />
      </AdminQueryState>
    </DepartmentSection>
  )
}
