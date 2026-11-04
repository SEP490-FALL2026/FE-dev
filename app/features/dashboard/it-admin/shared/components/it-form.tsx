export {
  AdminFormDialog as ItFormDialog,
  adminInputClass as itInputClass,
  adminButtonClass as itButtonClass,
  adminPrimaryClass as itPrimaryClass
} from '~/shared/ui/form-dialog'

import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export function ItField({
  label,
  children,
  hint,
  error
}: {
  label: string
  children: ReactNode
  hint?: string
  error?: string
}) {
  const { t: translate } = useTranslation('itAdmin')
  const id = useId()
  const control =
    isValidElement(children) &&
    typeof children.type === 'string' &&
    ['input', 'textarea', 'select'].includes(children.type)
      ? (children as ReactElement<{
          id?: string
          type?: string
          placeholder?: string
          'aria-describedby'?: string
          'aria-invalid'?: boolean
        }>)
      : null
  const controlId = control?.props.id ?? id
  const descriptionId = `${controlId}-description`
  const supportsPlaceholder =
    control &&
    (control.type === 'textarea' ||
      (control.type === 'input' && !['date', 'file', 'checkbox', 'radio'].includes(control.props.type ?? 'text')))
  return (
    <div className='grid min-w-0 gap-1.5 text-sm font-medium'>
      <label htmlFor={controlId}>{label}</label>
      {control
        ? cloneElement(control, {
            id: controlId,
            ...(supportsPlaceholder && !control.props.placeholder
              ? { placeholder: translate('fieldPlaceholder', { field: label }) }
              : {}),
            ...(error ? { 'aria-invalid': true } : {}),
            ...(hint || error
              ? { 'aria-describedby': [control.props['aria-describedby'], descriptionId].filter(Boolean).join(' ') }
              : {})
          })
        : children}
      {(hint || error) && (
        <span
          id={descriptionId}
          className={`min-h-5 text-xs font-normal ${error ? 'text-danger' : 'text-muted-foreground'}`}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
