import { Children, Fragment, isValidElement, useMemo, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchableSelect, type SearchableOption } from '~/shared/ui/searchable-select'

/** Same shape the native `<select>` handlers read (`event.target.value`), so existing call sites keep working. */
export interface FinanceSelectChangeEvent {
  target: { value: string }
  currentTarget: { value: string }
}

export interface FinanceSelectProps {
  value?: string | number | null
  onChange?: (event: FinanceSelectChangeEvent) => void
  /** Preferred for new code: receives the picked value directly. */
  onValueChange?: (value: string, option: SearchableOption | null) => void
  /** Options as data. When omitted, `<option>` children are read instead. */
  options?: readonly SearchableOption[]
  children?: ReactNode
  /** Describes what to pick ("… gõ để tìm"). An `<option value="" disabled>` child is used when not given. */
  placeholder?: string
  onSearchChange?: (query: string) => void
  selectedLabel?: string
  loading?: boolean
  emptyText?: string
  clearable?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  id?: string
  name?: string
  className?: string
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
}

interface OptionProps {
  value?: string | number | readonly string[]
  disabled?: boolean
  hidden?: boolean
  children?: ReactNode
}

function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

/** Flattens `<option>` (also inside fragments, arrays and `<optgroup>`) into searchable options. */
function optionsFromChildren(children: ReactNode) {
  const options: SearchableOption[] = []
  let placeholder: string | undefined
  const visit = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return
      const element = child as ReactElement<OptionProps>
      if (element.type === Fragment || element.type === 'optgroup') return visit(element.props.children)
      if (element.type !== 'option') return
      const label = textOf(element.props.children).trim()
      const value = String(element.props.value ?? label)
      // `<option value="" disabled>Chọn …</option>` is a prompt, not a choice.
      if (value === '' && (element.props.disabled || element.props.hidden)) {
        placeholder = label
        return
      }
      options.push({ value, label, disabled: element.props.disabled || undefined })
    })
  }
  visit(children)
  return { options, placeholder }
}

/**
 * Finance select field: a searchable combobox (type to filter) with the API of the native select it replaces. Inside
 * a `FinanceField` label the click default is cancelled so picking an option does not re-open the list.
 */
export function FinanceSelect({
  value,
  onChange,
  onValueChange,
  options,
  children,
  placeholder,
  invalid,
  'aria-invalid': ariaInvalid,
  className = '',
  ...rest
}: FinanceSelectProps) {
  const { t: translate } = useTranslation('finance')
  const fromChildren = useMemo(() => optionsFromChildren(children), [children])
  const list = options ?? fromChildren.options
  return (
    <div className={`min-w-0 ${className}`} onClick={(event) => event.preventDefault()}>
      <SearchableSelect
        {...rest}
        value={value === null || value === undefined ? '' : String(value)}
        options={list}
        invalid={invalid ?? (ariaInvalid === true || ariaInvalid === 'true')}
        placeholder={placeholder ?? fromChildren.placeholder ?? translate('ui.selectPlaceholder')}
        onChange={(next, option) => {
          onValueChange?.(next, option)
          onChange?.({ target: { value: next }, currentTarget: { value: next } })
        }}
      />
    </div>
  )
}
