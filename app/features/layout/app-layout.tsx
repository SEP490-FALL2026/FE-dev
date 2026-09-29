import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router'
import {
  BarChart3,
  CheckSquare,
  Clock,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  PieChart,
  Shield,
  Sparkles,
  Wallet,
  X
} from 'lucide-react'
import { LanguageSwitch } from '~/shared/ui/language-switch'
import { ThemeSwitch } from '~/shared/ui/theme-switch'

export function AppLayout() {
  const { t } = useTranslation(['approvals', 'finance', 'common'])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navSections = [
    {
      title: t('approvals:nav.title'),
      items: [
        {
          to: '/approvals/dashboard',
          label: t('approvals:nav.dashboard'),
          icon: LayoutDashboard
        },
        {
          to: '/approvals/queue',
          label: t('approvals:nav.queue'),
          icon: CheckSquare,
          badge: '4'
        },
        {
          to: '/approvals/reports',
          label: t('approvals:nav.reports'),
          icon: BarChart3
        }
      ]
    },
    {
      title: t('finance:nav.title'),
      items: [
        {
          to: '/finance/dashboard',
          label: t('finance:nav.dashboard'),
          icon: BarChart3
        },
        {
          to: '/finance/software-directory',
          label: t('finance:nav.softwareDirectory'),
          icon: FileText
        },
        {
          to: '/finance/budget-snapshot',
          label: t('finance:nav.snapshot'),
          icon: PieChart
        },
        {
          to: '/finance/renewals',
          label: t('finance:nav.renewals'),
          icon: Clock,
          badge: '2'
        },
        {
          to: '/finance/commitments',
          label: t('finance:nav.commitments'),
          icon: Wallet
        },
        {
          to: '/finance/shadow-it',
          label: t('finance:nav.shadowIt'),
          icon: CreditCard,
          badge: '3'
        }
      ]
    }
  ]

  return (
    <div className='flex min-h-screen bg-background text-foreground antialiased selection:bg-primary/20'>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden'
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className='flex h-16 items-center justify-between border-b border-border px-6'>
          <Link to='/approvals/queue' className='flex items-center gap-3 group'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105'>
              <Shield className='h-5 w-5' />
            </div>
            <div>
              <div className='flex items-center gap-1.5 font-bold text-lg tracking-tight'>
                {t('common:brand')}
                <span className='rounded bg-primary-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary'>
                  {t('common:mvpBadge')}
                </span>
              </div>
              <p className='text-xs text-muted-foreground'>{t('common:subtitle')}</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className='rounded-lg p-1 text-muted-foreground hover:bg-surface hover:text-foreground lg:hidden'
            aria-label={t('common:closeSidebar')}
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Current Active User Profile Card */}
        <div className='m-4 rounded-xl border border-border bg-surface p-3.5 shadow-xs'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary'>
              {t('common:demoUserTitle')}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-xs font-medium text-foreground'>{t('common:demoUserName')}</p>
              <p className='truncate text-[11px] text-muted-foreground'>{t('common:userRole')}</p>
            </div>
            <span className='inline-flex h-2 w-2 rounded-full bg-success ring-4 ring-success/20' />
          </div>
        </div>

        {/* Navigation Items */}
        <div className='flex-1 overflow-y-auto px-4 py-2 space-y-6'>
          {navSections.map((section) => (
            <div key={section.title} className='space-y-1.5'>
              <h3 className='px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground'>
                {section.title}
              </h3>
              <nav className='space-y-1'>
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/20'
                            : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                        }`
                      }
                    >
                      <div className='flex items-center gap-3'>
                        <Icon className='h-4 w-4' />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className='flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-soft px-1.5 text-[11px] font-bold text-primary'>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer info & quick reference links */}
        <div className='border-t border-border p-4 space-y-3'>
          <div className='rounded-lg bg-surface-subtle p-3 text-xs text-muted-foreground space-y-1'>
            <div className='flex items-center gap-1.5 font-medium text-foreground'>
              <Sparkles className='h-3.5 w-3.5 text-primary' />
              <span>{t('common:userFlowsCompliance')}</span>
            </div>
            <p className='text-[11px] leading-relaxed'>{t('common:userFlowsDesc')}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className='flex min-w-0 flex-1 flex-col'>
        {/* Top Header Navbar */}
        <header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className='rounded-lg p-2 text-muted-foreground hover:bg-surface-subtle hover:text-foreground lg:hidden'
              aria-label={t('common:openNavigation')}
            >
              <Menu className='h-5 w-5' />
            </button>
            <div className='hidden sm:block'>
              <span className='text-xs font-medium text-muted-foreground'>{t('common:headerSub')}</span>
            </div>
          </div>

          {/* Right Header Toolbar: Language & Theme Switches */}
          <div className='flex items-center gap-3'>
            <LanguageSwitch />
            <div className='h-4 w-px bg-border' />
            <ThemeSwitch />
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className='flex-1 p-4 sm:p-6 lg:p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
