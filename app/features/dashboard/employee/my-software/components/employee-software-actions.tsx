import { useId, useRef, useState } from 'react'
import { MoreHorizontal, Repeat, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { MySoftwarePageResponseDtoDataItemsItem } from '~/shared/api/generated/model/me/mySoftwarePageResponseDtoDataItemsItem'
import { AnchoredPopover } from '~/shared/ui/anchored-popover'
import type { EmployeeTabKey } from '../../enums'
import { canSelectRequestAssignment } from '../../shared/request-assignment-actions'

export function EmployeeSoftwareActions({
  item,
  onSelectTab
}: {
  item: MySoftwarePageResponseDtoDataItemsItem
  onSelectTab: (tab: EmployeeTabKey, params?: Record<string, string>) => void
}) {
  const { t } = useTranslation('employee')
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLButtonElement>(null)
  const id = useId()
  const actions = [
    { mode: 'renewal', icon: Repeat },
    { mode: 'return', icon: Undo2 }
  ] as const
  const available = actions.filter(({ mode }) => canSelectRequestAssignment(item, mode))
  if (!available.length) return null
  return (
    <>
      <button
        ref={anchor}
        id={`${id}-label`}
        type='button'
        aria-label={t('softwareRights.actionsFor', { name: item.application.name })}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-haspopup='dialog'
        className='inline-grid size-11 place-items-center rounded-md text-primary-ink transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary'
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal aria-hidden strokeWidth={1.5} className='size-5' />
      </button>
      {open && (
        <AnchoredPopover compact anchor={anchor} id={id} labelId={`${id}-label`} onClose={() => setOpen(false)}>
          <div className='p-1'>
            {available.map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                type='button'
                className='flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-primary'
                onClick={() => {
                  setOpen(false)
                  onSelectTab('create-request', { mode, assignmentId: item.assignmentId })
                }}
              >
                <Icon aria-hidden strokeWidth={1.5} className='size-4' />
                {t(mode)}
              </button>
            ))}
          </div>
        </AnchoredPopover>
      )}
    </>
  )
}
