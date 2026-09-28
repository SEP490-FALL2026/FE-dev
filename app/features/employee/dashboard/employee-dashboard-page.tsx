import { CalendarX, ChartPie, Clock, Laptop, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { QuickActions } from './components/quick-actions'
import { RecommendedSoftware } from './components/recommended-software'
import { SoftwareTable } from './components/software-table'
import { SummaryCards } from './components/summary-cards'
import { TipsBanner } from './components/tips-banner'
import { UpcomingDeadlines } from './components/upcoming-deadlines'
import { UsageSummary } from './components/usage-summary'

// ---------------------------------------------------------------------------
// Shared types for child components (co-located with page)
// ---------------------------------------------------------------------------

export interface SummaryCardData {
  titleKey: string
  subtitleKey: string
  footerKey: string
  value: number
  change?: number
  accent: string
  icon: LucideIcon
}

export interface SoftwareItem {
  name: string
  vendor: string
  logo: string
  plan: string
  status: string
  assignedDate: string
  expirationDate?: string
  daysLeft?: number
  usage: number
}

export interface RecommendedItem {
  name: string
  description: string
  logo: string
  badge: string
  badgeVariant: string
}

export interface DeadlineItem {
  name: string
  logo: string
  daysLeft: number
  expirationDate: string
}

// ---------------------------------------------------------------------------
// Mock data — will be replaced by TanStack Query hooks once API is ready
// ---------------------------------------------------------------------------

const summaryCards: SummaryCardData[] = [
  {
    titleKey: 'dashboard.cards.mySoftware.title',
    subtitleKey: 'dashboard.cards.mySoftware.subtitle',
    footerKey: 'dashboard.cards.mySoftware.footer',
    value: 6,
    change: 1,
    accent: 'brand',
    icon: Laptop
  },
  {
    titleKey: 'dashboard.cards.pendingRequests.title',
    subtitleKey: 'dashboard.cards.pendingRequests.subtitle',
    footerKey: 'dashboard.cards.pendingRequests.footer',
    value: 2,
    change: 1,
    accent: 'warning',
    icon: Clock
  },
  {
    titleKey: 'dashboard.cards.expiringSoon.title',
    subtitleKey: 'dashboard.cards.expiringSoon.subtitle',
    footerKey: 'dashboard.cards.expiringSoon.footer',
    value: 1,
    change: 0,
    accent: 'danger',
    icon: CalendarX
  },
  {
    titleKey: 'dashboard.cards.totalRequests.title',
    subtitleKey: 'dashboard.cards.totalRequests.subtitle',
    footerKey: 'dashboard.cards.totalRequests.footer',
    value: 12,
    change: 3,
    accent: 'dark',
    icon: ChartPie
  }
]

const softwareItems: SoftwareItem[] = [
  {
    name: 'Figma',
    vendor: 'Figma, Inc.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVxFFNt2vRyRGcOu_8gr4Obkb3WERhVPKaOxA-uNIxrvrj4ZUJxFPwcxEFkVJaWmBLEEe2iA_wfTlFj5HG1T506dOOv1ZzfJ1OBt9Qy0ErNWE_xns65jwbBmUTFLhKwIzpGZsfPPQg5eqYKHY23vuI_rjVpMKtQdsaZLPTEzJqIwXLvpjHV832-gNXhjSvRXdn6QHgBDXg1mX_BDfUbWnk8wjy8XabrXv9NoQzNUQ_Swy9ijc4QS2Y',
    plan: 'Professional',
    status: 'Active',
    assignedDate: 'Jan 15, 2026',
    expirationDate: 'Dec 31, 2026',
    daysLeft: 128,
    usage: 78
  },
  {
    name: 'GitHub',
    vendor: 'GitHub, Inc.',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwjsN84J1ooFsYclGirIY6zqigRrWLhlDBauqLFp2jmm6BjS68Hn3DtCsB_hIu0UYhVl9yq4_yd5D3Aj9CK3XvGTnSG1xN2MVtoAezvkLVAcKIznYZDozoat-cmVZe5Enw3Sl1uzrGLrBVzlDn2r6PUb_i5IPHStSlyNokBxA2qSE1uxZbZRIYyvnRfC0FpmwpriMesuipMWM3G3ylBU-O8tkGFcm2E-skz1KnAFWTkFKontqZQD7q',
    plan: 'Enterprise',
    status: 'Active',
    assignedDate: 'Feb 03, 2026',
    usage: 92
  },
  {
    name: 'Jira',
    vendor: 'Atlassian',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxOiH7WexWtITgr0_-8xLaemb0chJOGP6SR7cV6J6PbMhPX74FUEJbKJA9_VTS7zPFegi8e3Ae4zbse1R1vK609oLAbFwSNBwnzfSJ1qW6IXGZpk05Axw_rsEugN2-zEzG2kmRTX1WedrP66hxaq7rKRCOszzXm3g79aMzESr-_vw1LYWvGNGY6-fs5rBCuUJcUFT-6Amose0vY4WshGUL5rQsdMKUOSsfxh1KZBiroc8QpsitBLM-',
    plan: 'Standard',
    status: 'Active',
    assignedDate: 'Mar 12, 2026',
    usage: 65
  },
  {
    name: 'Slack',
    vendor: 'Slack Technologies',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6hNPzAwGzLMqjkfHXKILFxZ1P8aAokGkU5kRVb_T3PMp7stCsCfZxosBL-0lR7wJB3sgSJXiGzqOGQEVUGstk_AtgmuQw34WTvilmmULuku85F_wZ9vhfaZJEorAIVD-CEduv1yhxEMf2sq4zHyBR2JVBKvLUfGdXcnkUQWFR0fcM76wjjWPWDVKD9lf7kP8RqlpbJ7Zx2gRp1SxMp66yHhNanBvL1RUN1L_HdfFr9-P4mYApwjMH',
    plan: 'Pro',
    status: 'Active',
    assignedDate: 'Mar 20, 2026',
    usage: 80
  }
]

const recommendedItems: RecommendedItem[] = [
  {
    name: 'Notion',
    description: 'All-in-one workspace',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZNsjx2ze-dBm-PlU2hui9RaJJoRnSHH3PKTpjTi9uMMfdmu-d-vVsX_QDCGoioA8nNv8or8ZPe6NLK35NcBt5KdjJLixQ2hpTGtCyfRWJyywQYS2EFaSf9azdGhsNPjvRAePJnKcIJXLkxRpS14BMUMnNLZ68dH3melYSI9yfRQK8FMrzLWuNXZNUS1DYPs_XDSoaCpEI0AJx_TUF36W55NOabZ2ggLxdTUBKkOJESfGvNpfgOg4H',
    badge: 'Popular in Engineering',
    badgeVariant: 'brand'
  },
  {
    name: 'Figma',
    description: 'Design & Prototyping',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5Pn7FMvdeYbV1VG_Qg4JIddkXDoTHj1S7BJ-COmWH1OxEDdnzoOB7GbWwZEaQQ09v4AI9-w6UVHLCHZyo5rcMg1YZrHVlIWl66IHKg-tdFbAuC42B8WPH_Qmr-jWOVPywt2PbG4N2r3yqYLFITG2xCxoPIdA8bRbjHtscVsIQxva75OSXwvE5c5EvLf4-l1I3tlbBxCFCtVQxVWvD3k5LqERYd4FdKKhEVacFrOF-3xUnluIcpfOB',
    badge: 'Top rated',
    badgeVariant: 'success'
  },
  {
    name: 'Linear',
    description: 'Issue tracking',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhr9SFldHrMa5q3T9MKe_jmoACS9runz-a5fQYjZnWFE-EunkTWAOLpzPxQwrd1ZUSTRTR-gXXWy5-vsBZCv6PymwLacs9Ekc6kR-Qm-HFC6NonQyS-sZJHN9evEtdVWZoPLNqU4wafNyARkb7zs6p1ka24vausqoS8RCjGrIkEf1Rw9TKFg0WGuZYNWFj5-aM3GG-XfFdb1Yxh6ubkvc7Kd7Y-UIuxckAbsDO0j-wGx2wFZHGs3Di',
    badge: 'Recommended',
    badgeVariant: 'success'
  },
  {
    name: 'Postman',
    description: 'API Platform',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMcH1LMD9Zp8tCwXTTQSojR5kjYQY_PTrArmhqSTKO0IpNDTV_E017QOFidEA2WEZ8RMZg_8n-RBqzn-WPpv0gFVCmYI9ovhTVXyOkv6x_JlO0bWrsTxZHfgnQRn2Q06O3CziIFqeX0WpjOJ1_5WvUgjIVpA5aTImVB6ZxTFGE9lHNdf6zGZ6zIJAqlw1wKWl9XNfNwHuovoW0_7QW9pxbnvIjUuy2yxYMeObPv5Z2bglFU5-Q4vYU',
    badge: 'Popular',
    badgeVariant: 'brand'
  }
]

const deadlineItems: DeadlineItem[] = [
  {
    name: 'Figma Professional',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeqaC3hkRnH9KSXAjt19ikmO6jvfMzO-9Ty2-zUraBbNawVLlz0SN4lcjTvCt6QOwa9HaOz3i77oBeE8O0y7jFnr9k2gt8Lm9mqHQwN8_8aG4jGSjKsZhWByk6j6GMs2tgLCOQ7STBaY4mu_Tt2k6rg14gzLSUsfcsumF5ddBr-uL5H9KBShhaQd2W0cvCm6lUFj6aj4dXa3vIyVhUueAc8JmyFPCteBPqHgSrSO4o6KoZTVXhoKmx',
    daysLeft: 128,
    expirationDate: 'Dec 31, 2026'
  }
]

const usageLegend = [
  { labelKey: 'dashboard.usageSummary.activelyUsed', count: 4, percentage: 67, color: '#FC7523' },
  { labelKey: 'dashboard.usageSummary.lowUsage', count: 1, percentage: 17, color: '#FCB978' },
  { labelKey: 'dashboard.usageSummary.notUsed', count: 1, percentage: 16, color: '#EDE7E2' }
]

// ---------------------------------------------------------------------------
// Greeting helper
// ---------------------------------------------------------------------------

function getGreetingKey(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'dashboard.greeting.morning'
  if (hour < 18) return 'dashboard.greeting.afternoon'
  return 'dashboard.greeting.evening'
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function EmployeeDashboardPage() {
  const { t, i18n } = useTranslation()
  const today = new Date()
  const dateFormatted = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(today)
  const dayOfWeek = new Intl.DateTimeFormat(i18n.resolvedLanguage, { weekday: 'long' }).format(today)

  return (
    <>
      {/* Greeting & Date */}
      <div className='mb-8 flex items-end justify-between'>
        <div>
          <h2 className='mb-1 text-3xl font-bold text-neutral-900'>{t(getGreetingKey(), { name: 'An' })}</h2>
          <p className='text-neutral-500'>{t('dashboard.greeting.subtitle')}</p>
        </div>
        <div className='text-right text-sm text-neutral-500'>
          <p className='font-medium text-neutral-900'>{dateFormatted}</p>
          <p className='capitalize'>{dayOfWeek}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards cards={summaryCards} />

      {/* Main Grid */}
      <div className='grid grid-cols-12 gap-6'>
        {/* Left column */}
        <div className='col-span-8 space-y-6'>
          <SoftwareTable items={softwareItems} shownCount={4} totalCount={6} />
          <RecommendedSoftware items={recommendedItems} />
        </div>

        {/* Right column */}
        <div className='col-span-4 space-y-6'>
          <UpcomingDeadlines items={deadlineItems} />
          <QuickActions />
          <UsageSummary averageUsage={78} legend={usageLegend} />
          <TipsBanner />
        </div>
      </div>
    </>
  )
}
