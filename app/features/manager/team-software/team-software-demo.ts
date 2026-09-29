export interface TeamSoftware {
  id: string
  name: string
  category:
    'design' | 'development' | 'project' | 'communication' | 'creative' | 'productivity' | 'whiteboard' | 'video'
  plan: string
  total: number
  inUse: number
  available: number
  usage: number
  expiring: number
  ghost: number
  monthlyCost: number
  status: 'active'
}
export const samplePeriod = { from: '2026-05-18', to: '2026-05-24' } as const
export const teamSoftware: TeamSoftware[] = [
  {
    id: 'figma',
    name: 'Figma',
    category: 'design',
    plan: 'Professional',
    total: 10,
    inUse: 8,
    available: 2,
    usage: 0.8,
    expiring: 1,
    ghost: 1,
    monthlyCost: 150,
    status: 'active'
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'development',
    plan: 'Enterprise',
    total: 20,
    inUse: 18,
    available: 2,
    usage: 0.9,
    expiring: 1,
    ghost: 1,
    monthlyCost: 420,
    status: 'active'
  },
  {
    id: 'jira',
    name: 'Jira',
    category: 'project',
    plan: 'Standard',
    total: 15,
    inUse: 13,
    available: 2,
    usage: 0.87,
    expiring: 0,
    ghost: 1,
    monthlyCost: 225,
    status: 'active'
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    plan: 'Pro',
    total: 20,
    inUse: 19,
    available: 1,
    usage: 0.95,
    expiring: 0,
    ghost: 0,
    monthlyCost: 200,
    status: 'active'
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    category: 'creative',
    plan: 'All Apps',
    total: 10,
    inUse: 7,
    available: 3,
    usage: 0.7,
    expiring: 0,
    ghost: 0,
    monthlyCost: 299.9,
    status: 'active'
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    plan: 'Plus',
    total: 5,
    inUse: 2,
    available: 3,
    usage: 0.4,
    expiring: 0,
    ghost: 0,
    monthlyCost: 25,
    status: 'active'
  },
  {
    id: 'miro',
    name: 'Miro',
    category: 'whiteboard',
    plan: 'Team',
    total: 10,
    inUse: 6,
    available: 4,
    usage: 0.6,
    expiring: 0,
    ghost: 0,
    monthlyCost: 80,
    status: 'active'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'video',
    plan: 'Pro',
    total: 10,
    inUse: 7,
    available: 3,
    usage: 0.75,
    expiring: 0,
    ghost: 0,
    monthlyCost: 150,
    status: 'active'
  }
]
