import { ACCOUNTS, type E2eRole } from './support/accounts'
import { expect, login, sweepSidebar, test } from './support/fixtures'

// Opens every sidebar entry of every role once. A tab that crashes, answers 5xx or shows an alert is listed in
// test-results/findings.md.
for (const role of Object.keys(ACCOUNTS) as E2eRole[]) {
  test(`${role}: mọi mục sidebar mở được`, async ({ page, report }) => {
    await login(page, role)
    const labels = await sweepSidebar(page, report)
    report.add('note', `${labels.length} mục: ${labels.join(' | ')}`)
    expect(page.url()).toContain(`/dashboard/${role}`)
  })
}
