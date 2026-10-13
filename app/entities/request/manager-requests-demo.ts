export const requestStatuses = ['pending', 'inProgress', 'approved', 'rejected', 'overdue'] as const
export const requestTypes = ['newAccess', 'upgrade', 'renewal', 'changePlan'] as const
export type RequestStatus = (typeof requestStatuses)[number]
export type RequestType = (typeof requestTypes)[number]

export interface TeamRequest {
  id: string
  name: string
  initials: string
  role: 'designer' | 'frontend' | 'backend' | 'qa' | 'devops' | 'analyst'
  software: string
  plan: string
  type: RequestType
  submitted: string
  hoursLeft: number
  slaFraction: number
  status: RequestStatus
  avatar: string
}

// Shared Manager presentation fixtures, not an API workflow model.
export const overviewCounts: Record<RequestStatus, number> = {
  pending: 12,
  inProgress: 3,
  approved: 8,
  rejected: 2,
  overdue: 2
}
export const teamRequests: TeamRequest[] = [
  {
    id: 'REQ-1024',
    name: 'Nguyễn Văn A',
    initials: 'NA',
    role: 'designer',
    software: 'Figma',
    plan: 'Professional',
    type: 'newAccess',
    submitted: '2026-08-23T09:15:00+07:00',
    hoursLeft: 18,
    slaFraction: 0.4,
    status: 'pending',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKZhmyMEeGtsl5TP-GuiNriGGEQoMrbcjpn1Ahs6sxQtK8wN0jb5ZuwVhgO1a4PIZNTMG5aXEnpfjmvDjMuG7qcaULlFoasNqQnmAJ_Q6pj6zTTshUw2alqviVqBe6skEZJ9nF6p7YHiw0Ofkzq0O66_tdvl5d9qOInXAbG5RLuhGd7kAOCJwHUFL5vcIQnC_a2EJMALArYRVG-Pu_2h2MPKnyzJxMida_Q2eKW46Mzx87E9Nhv-1E'
  },
  {
    id: 'REQ-1027',
    name: 'Trần Minh B',
    initials: 'TB',
    role: 'frontend',
    software: 'GitHub',
    plan: 'Enterprise',
    type: 'upgrade',
    submitted: '2026-08-23T10:42:00+07:00',
    hoursLeft: 20,
    slaFraction: 0.45,
    status: 'pending',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqYePUzKPsmUFz21UNqpIyMSW7kuBHE6jvet5wJqisEztWmX4FhxOALPjq4C_oO05sqC8R4S4VvhknbEioKvj6JNYtP0CGIFsAABsXawaa4TRWQHWDMA29_YMiY6a2_7qkmL33yBjFGXwQ5V5KT1hwY2GXZpDb4_fsAEUMvuNl-JDe1mHyLXT9TJzUcf4ClKBcjR68DeVXP3a98Z8_J-mKrGurfY8ixmwXElzcLiaM7yWP50OK5FoO'
  },
  {
    id: 'REQ-1029',
    name: 'Lê Hoàng C',
    initials: 'LC',
    role: 'backend',
    software: 'Jira',
    plan: 'Standard',
    type: 'renewal',
    submitted: '2026-08-23T11:08:00+07:00',
    hoursLeft: 22,
    slaFraction: 0.5,
    status: 'pending',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC02fXXm8B8LYewe74-Nym2wiEDCDLHBpVhGJjP3jKsDGMAnHPNbK0rYCM5_SfPKyBmBIqPOfnfo_mBc52ZFHuED-iuuc5v-tYfWkOdeTM1APDnr_XmC8SXpnKyyQSDVpqBcUb6fUtd3IBe3SgZeCmnWDfYcLi4x_FAblUlCivzaoFZkicvj2r5fqiNOOtscC1UuOXOozOT1b4etsZl1c-MgxKBPkEYjSg-dBeOdzHIHbtmu1QgY3q1'
  },
  {
    id: 'REQ-1031',
    name: 'Phạm Thu D',
    initials: 'PD',
    role: 'qa',
    software: 'Slack',
    plan: 'Pro',
    type: 'changePlan',
    submitted: '2026-08-23T11:30:00+07:00',
    hoursLeft: 24,
    slaFraction: 0.8,
    status: 'pending',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXTCDIqq8SZIXQPkDQ42iT9ZIpviKec7-G4cUJbdHe-6W6qGdiAQletkA0FXTRkkFcNeIdoXwUXvMQQ73aLz1l2zT2sDNKPkaKmXbO8oyFlpIA0flFziT3dn6QQmQBcxNUDwionHfte0J2DuuI44yslgIABzcPyKE-O2kTKIBoSS4mOKvNAIwNB4LGmkfufgNHLIelH50J3M9vhGfIJwOIpN9QSC9gHHSo9N0fr6VFx6g0hDjzuDb3'
  },
  {
    id: 'REQ-1033',
    name: 'Hoàng Anh E',
    initials: 'HE',
    role: 'devops',
    software: 'AWS Console',
    plan: 'Developer',
    type: 'newAccess',
    submitted: '2026-08-23T10:23:00+07:00',
    hoursLeft: 16,
    slaFraction: 0.35,
    status: 'inProgress',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUuS-b1tQ3zzvZuH2Dtn3LSw7Ho5KMzWjeBVNuPnlSEP1sNguekPZo7nJ2PHKFyhPyj91uhB-dgDS5NmOWg6ADIk9jMUlBTaF-J1lf5tTr9bYLNQBfC0xLbXiPrTSLmE1UBEJMapj9wv1ImsH4FGxmEramjUmAY8qu7bFsjGpAYCnKwNjdzZL5hjz2nPy_vxocrgOluZCP36XqO2l0gpUu4pzl0WoO7L3PRvxP75l6x_scBc7dgEtr'
  },
  {
    id: 'REQ-1034',
    name: 'Nguyễn Thủy F',
    initials: 'NF',
    role: 'analyst',
    software: 'Tableau',
    plan: 'Creator',
    type: 'renewal',
    submitted: '2026-08-23T09:42:00+07:00',
    hoursLeft: 6,
    slaFraction: 0.15,
    status: 'overdue',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3i5DXV2EK5iA3r2qhOGl2R6NCgfkiKlFPNLBHmSC0TuWX1z7NC-tuw5uPyuV78OF5iB4H_EclPDubgDwuAceUtdoBJ3rcZPX8eSqT4dLMB4d8yjkP8SZvwoi7MZS6_xguxpS_jTapQIETs8UlYPoJv-SxxQZZAuo2TkIrmTtU6yRhVGXu1fNgjb0KNjWXoy6eyVgsr9sRxoyEweMsqjn7vgYLyqB8mrf799okzX7G9xmFoQM7HF2O'
  }
]
