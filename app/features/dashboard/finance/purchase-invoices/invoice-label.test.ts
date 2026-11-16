import { beforeEach, describe, expect, it } from 'vitest'
import { i18n, setAppLanguage } from '~/shared/i18n/i18n'
import { financePurchases } from '~/shared/i18n/locales/en/finance-purchases'
import { invoiceLabelText, invoiceSpend } from './invoice-label'

describe('invoice label and spend', () => {
  beforeEach(async () => {
    i18n.addResourceBundle('en', 'financePurchases', financePurchases)
    await setAppLanguage('en', false)
  })
  const translate = () => i18n.getFixedT('en', 'financePurchases')

  it('writes the label the way BE derives it', () => {
    expect(invoiceLabelText(translate(), 'NEW_PURCHASE', 1, 6)).toBe('New purchase — month 1/6')
    expect(invoiceLabelText(translate(), 'PERIOD', 2, 6)).toBe('Period 2/6')
    expect(invoiceLabelText(translate(), 'PERIOD', 2, null)).toBe('Period 2')
    expect(invoiceLabelText(translate(), 'RENEWAL', null, null)).toBe('Renewal')
  })

  it('books the price before tax plus the tax that cannot be deducted', () => {
    expect(invoiceSpend({ amount: '527000', currency: 'VND' }, { amount: '52700' })).toEqual({
      amount: '579700',
      currency: 'VND'
    })
    expect(invoiceSpend({ amount: '527000', currency: 'VND' }, null)).toEqual({ amount: '527000', currency: 'VND' })
  })
})
