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
      { label: 'Projects', path: '/projects', icon: FolderKanban },
      { label: 'Tenders', path: '/tenders', icon: FileText },
      { label: 'Contracts', path: '/contracts', icon: PenTool },
      { label: 'Contractors', path: '/contractors', icon: Users },
    ],
  },
  {
    label: 'Risk & Investigation',
    items: [
      { label: 'Risk Explorer', path: '/risk', icon: Gauge },
      { label: 'Investigation Center', path: '/investigations', icon: Search },
      { label: 'AI Investigator', path: '/ai-investigator', icon: Bot },
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
    <div className="flex flex-col h-full bg-navy-900 text-slate-300">
      {/* Logo */}
      <div className={cn('flex items-center gap-2.5 px-4 h-16 border-b border-navy-800 flex-shrink-0', collapsed && 'justify-center px-2')}>
        <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-white tracking-tight leading-none">AARAMBHA</div>
            <div className="text-[9px] text-navy-300 mt-1 tracking-widest uppercase">Procurement Intelligence</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
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
            {collapsed && <div className="my-2 border-t border-navy-800 mx-2" />}
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
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn('border-t border-navy-800 px-3 py-3 flex-shrink-0', collapsed && 'px-2')}>
        {collapsed ? (
          <div className="flex justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-[11px] text-navy-200">System Operational</span>
            </div>
            <div className="text-[10px] text-navy-400">
              <div>Data updated: 03 Sep 2026</div>
              <div className="mt-0.5 inline-flex items-center gap-1">
                <span className="px-1 py-0.5 bg-navy-800 rounded text-navy-300 font-medium">DEMO</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle - desktop only */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute top-20 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-500 hover:text-navy-700 hover:border-navy-300 shadow-sm transition-all z-10"
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
          'hidden lg:flex flex-col flex-shrink-0 relative transition-all duration-200 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-[256px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-[256px] animate-slide-in-right">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
