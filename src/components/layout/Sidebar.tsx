import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  FolderKanban,
  FileText,
  PenTool,
  Users,
  Gauge,
  Search,
  Bot,
  FileBarChart,
  Database,
  BookOpen,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Landmark,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navSections = [
  {
    label: 'Overview',
    items: [
      { label: 'Parliamentary MPs', path: '/constituencies', icon: Landmark, badge: '774', badgeColor: 'bg-sky-500/15 text-sky-300 border border-sky-500/25' },
      { label: 'Projects', path: '/projects', icon: FolderKanban, badge: '774' },
      { label: 'Tenders', path: '/tenders', icon: FileText },
      { label: 'Contracts', path: '/contracts', icon: PenTool },
      { label: 'Contractors', path: '/contractors', icon: Users },
    ],
  },

  {
    label: 'Risk & Investigation',
    items: [
      { label: 'Risk Explorer', path: '/risk', icon: Gauge, badge: '83', badgeColor: 'bg-amber-500/15 text-amber-300 border border-amber-500/25' },
      { label: 'Investigation Center', path: '/investigations', icon: Search, badge: '38', badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30' },
      { label: 'AI Investigator', path: '/ai-investigator', icon: Bot, badge: 'LIVE', badgeColor: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' },
    ],
  },
  {
    label: 'Reporting',
    items: [
      { label: 'Reports', path: '/reports', icon: FileBarChart },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Data Sources', path: '/data-sources', icon: Database },
      { label: 'Methodology', path: '/methodology', icon: BookOpen },
      { label: 'System Status', path: '/system-status', icon: Activity },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 50%, #0a1628 100%)',
    }}>
      {/* Ambient glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)' }}
      />

      {/* Logo */}
      <div className={cn('flex items-center gap-2.5 px-4 h-16 flex-shrink-0 relative z-10', collapsed && 'justify-center px-2')}
        style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.06)' }}
      >
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 relative" style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
          boxShadow: '0 0 20px -4px rgba(56, 189, 248, 0.4)',
        }}>
          <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-white tracking-tight leading-none">AARAMBHA</div>
            <div className="text-[9px] mt-1 tracking-widest uppercase" style={{ color: '#38bdf8' }}>
              Procurement Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2.5 relative z-10">
        {/* Overview link */}
        <NavLink
          to="/overview"
          onClick={onMobileClose}
          className={({ isActive }) =>
            cn('nav-link mb-1', isActive && 'nav-link-active', collapsed && 'justify-center px-2')
          }
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Overview</span>}
        </NavLink>

        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && <div className="nav-section-label">{section.label}</div>}
            {collapsed && <div className="my-2 mx-2" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)' }} />}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onMobileClose}
                  className={cn('nav-link mb-0.5', isActive && 'nav-link-active', collapsed && 'justify-center px-2')}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0 ml-2.5">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={cn('text-[9px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ml-1', item.badgeColor || 'bg-slate-800/80 text-slate-400 border border-slate-700/30')}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn('px-3 py-3 flex-shrink-0 relative z-10', collapsed && 'px-2')}
        style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)' }}
      >
        {collapsed ? (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-breathe" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-breathe" />
              <span className="text-[11px] text-slate-400">System Operational</span>
            </div>
            <div className="text-[10px] text-slate-500">
              <div>Data updated: 03 Sep 2026</div>
              <div className="mt-0.5 inline-flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide"
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                  }}
                >DEMO</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle - desktop only */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute top-20 -right-3 w-6 h-6 rounded-full items-center justify-center z-10 transition-all duration-200"
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          color: '#64748b',
          boxShadow: '0 2px 8px -2px rgba(0,0,0,0.4)',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col flex-shrink-0 relative transition-all duration-300 ease-in-out h-full',
          collapsed ? 'w-[68px]' : 'w-[256px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(0, 0, 0, 0.6)' }} onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-[256px] animate-slide-in-right">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
