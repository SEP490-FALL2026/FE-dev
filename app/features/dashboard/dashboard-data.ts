import type { UserRole } from '~/entities/user-role/user-role'

export type RoleProfile = { displayName: string; initials: string }

export const roleProfiles: Record<UserRole, RoleProfile> = {
  employee: { displayName: 'Đức Anh', initials: 'ĐA' },
  finance: { displayName: 'Ngọc Lan', initials: 'NL' },
  'it-admin': { displayName: 'Quang Huy', initials: 'QH' },
  manager: { displayName: 'Thu Hà', initials: 'TH' },
  'spending-approver': { displayName: 'Hoàng Nam', initials: 'HN' },
  'super-admin': { displayName: 'Minh Anh', initials: 'MA' }
}

export const notificationCount = 3

export const monthlyCosts = [
  { actual: 520_000_000, date: '2026-01-01', projected: 540_000_000 },
  { actual: 610_000_000, date: '2026-02-01', projected: 600_000_000 },
  { actual: 680_000_000, date: '2026-03-01', projected: 690_000_000 },
  { actual: 660_000_000, date: '2026-04-01', projected: 710_000_000 },
  { actual: 880_000_000, date: '2026-05-01', projected: 830_000_000 },
  { actual: 790_000_000, date: '2026-06-01', projected: 820_000_000 },
  { actual: 980_000_000, date: '2026-07-01', projected: 1_010_000_000 },
  { actual: 1_150_000_000, date: '2026-08-01', projected: 1_230_000_000 },
  { actual: 1_080_000_000, date: '2026-09-01', projected: 1_260_000_000 },
  { actual: 1_180_000_000, date: '2026-10-01', projected: 1_360_000_000 }
] as const

export const categoryCosts = [
  { color: 'var(--theme-primary)', key: 'productivity', value: 450_000_000 },
  { color: 'var(--theme-info)', key: 'design', value: 280_000_000 },
  { color: 'var(--theme-danger)', key: 'security', value: 210_000_000 },
  { color: 'var(--theme-warning)', key: 'infrastructure', value: 160_000_000 },
  { color: 'var(--theme-success)', key: 'other', value: 145_800_000 }
] as const

export const alerts = [
  { count: 8, key: 'expiring', tone: 'warning' },
  { count: 5, key: 'overLimit', tone: 'warning' },
  { count: 12, key: 'inactive', tone: 'danger' },
  { count: 7, key: 'unclassified', tone: 'info' }
] as const

export const topSoftware = [
  { cost: 450_000_000, name: 'ChatGPT Enterprise (OpenAI)' },
  { cost: 320_000_000, name: 'Claude Enterprise (Anthropic)' },
  { cost: 230_000_000, name: 'GitHub Copilot (OpenAI Codex)' },
  { cost: 180_000_000, name: 'Google Gemini Business (Workspace)' },
  { cost: 120_000_000, name: 'Google Gemini Code Assist' }
] as const

export const recentSoftware = [
  { addedAt: '2026-10-10', name: 'OpenAI Codex & API Access', seats: 25 },
  { addedAt: '2026-10-08', name: 'Claude Code (Anthropic Terminal Agent)', seats: 15 },
  { addedAt: '2026-10-05', name: 'Google Gemini Code Assist', seats: 40 },
  { addedAt: '2026-09-28', name: 'ChatGPT Enterprise (OpenAI)', seats: 50 },
  { addedAt: '2026-09-20', name: 'Claude Enterprise 3.7 Sonnet', seats: 30 }
] as const
