import { isValidElement, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminField as BaseAdminField } from '~/shared/ui/form-dialog'

export { AdminFormDialog, adminInputClass, adminButtonClass, adminPrimaryClass } from '~/shared/ui/form-dialog'

export function AdminField(props: ComponentProps<typeof BaseAdminField>) {
  const { t: translate } = useTranslation('admin')
  const control = isValidElement<{ type?: string; placeholder?: string; readOnly?: boolean; disabled?: boolean }>(
    props.children
  )
    ? props.children
    : null
  const type = control?.props.type
  // Pickers (AdminSelect and the role lookups) are components; their placeholder already says what to pick.
  const picker = !!control && typeof control.type !== 'string'
  const kind =
    control?.props.readOnly || control?.props.disabled
      ? 'readOnly'
      : picker || control?.type === 'select'
        ? 'select'
        : type === 'date' || type === 'datetime-local'
          ? 'date'
          : type === 'number'
            ? 'number'
            : type === 'search'
              ? 'search'
              : type === 'checkbox'
                ? 'checkbox'
                : 'text'
  const description =
    props.description ??
    (picker ? undefined : control?.props.placeholder) ??
    translate(`formHelp.${kind}`, { field: props.label })
  return <BaseAdminField {...props} description={description} />
}
