export type RequestTypeOptionId = 'new-software' | 'change-plan' | 'temporary-renewal' | 'return-license'

export interface RequestTypeCardItem {
  id: RequestTypeOptionId
  titleKey: string
  descriptionKey: string
  calloutKey: string
  iconType: 'plus' | 'arrows-swap' | 'clock' | 'rotate-ccw'
  themeColor: 'blue' | 'emerald' | 'purple' | 'orange'
  targetPath: string
}
