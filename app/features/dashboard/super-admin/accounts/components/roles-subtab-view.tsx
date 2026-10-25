import { CheckCircle2 } from 'lucide-react'
import type { UserAccount, UserAccountRole } from '../../super-admin-data'
import { roleDefinitions } from '../../super-admin-data'

export interface RolesSubtabViewProps {
  accounts: UserAccount[]
  onSelectAccount: (account: UserAccount) => void
}

export function RolesSubtabView({ accounts, onSelectAccount }: RolesSubtabViewProps) {
  return (
    <div className='space-y-6'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {(Object.keys(roleDefinitions) as UserAccountRole[]).map((rKey) => {
          const def = roleDefinitions[rKey]
          const holders = accounts.filter((a) => a.role === rKey)

          return (
            <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm' key={rKey}>
              <div className='flex items-start justify-between'>
                <div>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                      def.colorTone === 'primary'
                        ? 'border-primary/30 bg-primary/15 text-primary'
                        : def.colorTone === 'info'
                          ? 'border-info/30 bg-info/15 text-info'
                          : def.colorTone === 'warning'
                            ? 'border-warning/30 bg-warning/15 text-warning'
                            : def.colorTone === 'success'
                              ? 'border-success/30 bg-success/15 text-success'
                              : def.colorTone === 'danger'
                                ? 'border-danger/30 bg-danger/15 text-danger'
                                : 'border-border bg-surface-subtle text-muted-foreground'
                    }`}
                  >
                    {def.name}
                  </span>
                  {def.isSingleton && (
                    <p className='mt-1 text-[0.65rem] font-bold text-muted-foreground uppercase'>
                      Duy nhất 1 tài khoản
                    </p>
                  )}
                </div>

                <span className='rounded-xl border border-border bg-surface-subtle px-2 py-1 text-xs font-mono font-bold text-foreground'>
                  {holders.length} người
                </span>
              </div>

              <p className='mt-3 text-xs text-muted-foreground leading-relaxed'>{def.description}</p>

              <div className='mt-4 space-y-1.5 border-t border-border pt-3'>
                <span className='text-[0.7rem] font-bold text-foreground uppercase tracking-wider'>
                  Trách nhiệm chính:
                </span>
                <ul className='space-y-1 text-[0.7rem] text-muted-foreground'>
                  {def.responsibilities.map((resp, idx) => (
                    <li className='flex items-start gap-1.5' key={idx}>
                      <CheckCircle2 className='size-3 text-success shrink-0 mt-0.5' />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='mt-4 border-t border-border pt-3'>
                <span className='text-[0.7rem] font-bold text-foreground'>Nhân sự đang giữ role:</span>
                <div className='mt-1 space-y-1 max-h-32 overflow-y-auto'>
                  {holders.map((h) => (
                    <div
                      className='flex items-center justify-between rounded-lg bg-surface-subtle p-1.5 text-xs'
                      key={h.id}
                    >
                      <span className='font-bold text-foreground truncate max-w-[140px]'>{h.name}</span>
                      <button
                        className='text-[0.7rem] font-semibold text-primary hover:underline'
                        onClick={() => onSelectAccount(h)}
                        type='button'
                      >
                        Quản lý
                      </button>
                    </div>
                  ))}

                  {holders.length === 0 && (
                    <p className='text-[0.7rem] text-warning italic'>Chưa có nhân sự nào giữ role này.</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
