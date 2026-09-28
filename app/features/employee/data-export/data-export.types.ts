export type ExportCategoryId = 'personal' | 'software' | 'requests' | 'telemetry'

export type ExportFormat = 'json' | 'csv'

export interface ExportCategoryItem {
  id: ExportCategoryId
  titleKey: string
  sizeKey: string
  descriptionKey: string
  approxBytes: number
}

export interface DataExportFormData {
  selectedCategories: Record<ExportCategoryId, boolean>
  format: ExportFormat
  email: string
  passwordProtection: boolean
  passphrase: string
  purpose: string
}

export interface RecentExportItem {
  id: string
  name: string
  format: 'ZIP' | 'CSV'
  details: string
  isExpired: boolean
  downloadUrl?: string
}
