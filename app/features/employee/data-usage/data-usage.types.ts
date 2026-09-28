import type { ComponentType } from 'react'

export interface UsageMetric {
  id: string
  label: string
  value: string
  suffix?: string
  sub: string
  icon: ComponentType<{ className?: string }>
  subIcon?: ComponentType<{ className?: string }>
}

export interface MonitoredAppItem {
  id: string
  name: string
  tier: string
  status: string
  integration: string
  lastActivityLabel: string
  lastActivityValue: string
  collected: string
  excluded: string
  purpose: string
}

export interface ClassificationRow {
  id: string
  title: string
  subtitle: string
  legalBasis: string
  retention: string
  recipients: string
  encryption: string
  isRetentionHighlight?: boolean
}

export interface AuditLogItem {
  id: string
  actor: string
  time: string
  purpose: string
  status: string
  meta: string
}
