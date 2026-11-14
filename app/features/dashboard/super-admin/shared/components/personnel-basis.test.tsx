import { fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { PersonnelForm, value } from './personnel-form'

beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('submits a required grounds note for direct personnel events', () => {
  const submit = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PersonnelForm
        title='Event'
        fields={[]}
        basis='note'
        pending={false}
        onClose={() => {}}
        onSubmit={(data) => submit(value(data, 'groundsNote'))}
      />
    </QueryClientProvider>
  )
  const note = screen.getByRole('textbox', { name: 'Authoritative basis' })
  expect(note).toBeRequired()
  expect(note).toHaveAttribute('placeholder')
  fireEvent.change(note, { target: { value: ' HR decision 42 ' } })
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(submit).toHaveBeenCalledWith('HR decision 42')
})

it('requires the last working day only when access is not blocked immediately', () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PersonnelForm
        title='Event'
        fields={[
          { name: 'lastWorkingDay', type: 'date', optionalWhenChecked: 'blockAccessNow' },
          { name: 'blockAccessNow', type: 'checkbox', optional: true }
        ]}
        pending={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    </QueryClientProvider>
  )
  const lastDay = screen.getByLabelText('Last working day')
  expect(lastDay).toBeRequired()
  fireEvent.click(screen.getByRole('checkbox'))
  expect(lastDay).not.toBeRequired()
})
