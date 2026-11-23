import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { setAppLanguage } from '~/shared/i18n/i18n'
import { CatalogPlanSetup } from './catalog-plan-setup'

const editorText = 'Editor opened'
const createText = 'Simulate creation'
vi.mock('./catalog-plan-subscriptions', () => ({ CatalogPlanSubscriptions: () => null }))
vi.mock('./catalog-workspace-setup', () => ({ CatalogWorkspaceSetup: () => null }))
vi.mock('./catalog-plan-terms', () => ({ CatalogPlanTerms: () => null }))
vi.mock('./catalog-subscription-editor', () => ({ CatalogSubscriptionEditor: () => <p>{editorText}</p> }))
vi.mock('./catalog-purchase-form', () => ({
  CatalogPurchaseForm: ({ onSubscriptionCreated }: { onSubscriptionCreated: (id: string) => void }) => (
    <button onClick={() => onSubscriptionCreated('sub')}>{createText}</button>
  )
}))

beforeEach(async () => {
  await setAppLanguage('en', false)
})

it('returns to plan setup after creating the subscription', () => {
  render(
    <CatalogPlanSetup
      plan={{
        id: 'plan',
        applicationId: 'app',
        applicationName: 'App',
        name: 'Team',
        provisioningType: 'K2',
        hasAdminConsole: true
      }}
      applicationKind='SAAS'
      onBack={() => {}}
    />
  )
  fireEvent.click(screen.getByRole('button', { name: 'Add subscription' }))
  fireEvent.click(screen.getByRole('button', { name: 'Simulate creation' }))
  expect(screen.queryByRole('button', { name: 'Simulate creation' })).not.toBeInTheDocument()
  expect(screen.queryByText('Editor opened')).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /App.*Team/ })).toBeVisible()
})
