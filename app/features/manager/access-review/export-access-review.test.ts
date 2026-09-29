import { expect, it } from 'vitest'
import { setAppLanguage, i18n } from '~/shared/i18n/i18n'
import { filterAccessAssignments } from '~/entities/license/access-assignments-demo'
import { buildAccessReviewCsv } from './export-access-review'

it('exports all filtered assignments with localized sample labels rather than overview totals', async () => {
  await setAppLanguage('en', false)
  const rows = filterAccessAssignments(new URLSearchParams('risk=medium'))
  const csv = buildAccessReviewCsv(rows, 'en', i18n.t)
  expect(csv).toContain('Sample access review')
  expect(csv).toContain('"Trần Bảo","GitHub","Enterprise"')
  expect(csv).toContain('"Jan 12, 2026","62 days ago","Medium","Pending"')
  expect(csv).not.toContain('Figma')
  await setAppLanguage('vi', false)
  expect(buildAccessReviewCsv(rows, 'vi', i18n.t)).toContain('"Nhân viên","Phần mềm"')
})
