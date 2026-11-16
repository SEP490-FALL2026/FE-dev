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
  const kind =
    control?.props.readOnly || control?.props.disabled
      ? 'readOnly'
      : control?.type === 'select'
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
    props.description ?? control?.props.placeholder ?? translate(`formHelp.${kind}`, { field: props.label })
  return <BaseAdminField {...props} description={description} />
}
