export const itCatalogTerms = {
  help: {
    termsUrl: 'Link to the vendor terms reviewed for this plan.',
    lastReviewedOn: 'The date IT last checked the terms against this plan.',
    maxDevicesPerKey: 'The maximum devices one license key may activate under these terms.',
    installNote: 'Describe activation, transfer and installation limits that IT must follow.'
  },
  title: 'Plan terms',
  uncertain: 'The result is uncertain. Close this form and review the opinion history before recording it again.',
  edit: 'Edit terms',
  warnings: 'Terms to review',
  open: 'Review terms',
  notApplicable: 'Terms review does not apply to internal K5 software.',
  termsUrl: 'Terms URL',
  lastReviewedOn: 'Last reviewed',
  aiTraining: 'AI training policy',
  dataLocation: 'Data location',
  commercialUse: 'Commercial use',
  cancellationRefund: 'Cancellation and refunds',
  maxDevicesPerKey: 'Devices per key',
  installNote: 'Installation restrictions',
  reviewFrom: 'Review from',
  opinions: 'Business owner opinions',
  recordOpinion: 'Record owner opinion',
  saveOpinion: 'Save opinion',
  opinion: 'Business owner opinion',
  opinionHint: 'An opinion is recorded as evidence; it does not add an approval step.',
  opinionPlaceholder: 'Record the business owner’s assessment of these terms',
  urlPlaceholder: 'https://vendor.example/terms',
  devicesPlaceholder: 'e.g. 3',
  installPlaceholder: 'Device limits, activation and transfer rules',
  placeholders: {
    aiTraining: 'May the vendor use company data for model training?',
    dataLocation: 'Countries or regions where data is stored',
    commercialUse: 'Conditions for company and commercial use',
    cancellationRefund: 'Notice period, refund and data export conditions'
  }
} as const
