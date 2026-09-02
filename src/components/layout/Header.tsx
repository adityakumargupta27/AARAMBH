import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  User,
  Settings,
  Activity,
  LogOut,
  Menu,
  Command,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { demoNotifications } from '@/data/mockData';

interface HeaderProps {
  onMobileMenuClick: () => void;
  onSearchClick: () => void;
}

interface Crumb {
  label: string;
  path?: string;
}

const routeLabels: Record<string, string> = {
  overview: 'Overview',
  projects: 'Projects',
  tenders: 'Tenders',
  contracts: 'Contracts',
  contractors: 'Contractors',
  risk: 'Risk Explorer',
  investigations: 'Investigation Center',
  'ai-investigator': 'AI Investigator',
  reports: 'Reports',
  'data-sources': 'Data Sources',
  methodology: 'Methodology',
  'system-status': 'System Status',
  settings: 'Settings',
};

export function Header({ onMobileMenuClick, onSearchClick }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState(demoNotifications);

  const crumbs: Crumb[] = [];
  const segments = location.pathname.split('/').filter(Boolean);
  let pathAccum = '';
  for (let i = 0; i < segments.length; i++) {
    pathAccum += '/' + segments[i];
    const label = routeLabels[segments[i]] || segments[i].toUpperCase();
    crumbs.push({ label, path: i < segments.length - 1 ? pathAccum : undefined });
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotifClick = (link?: string) => {
    if (link) navigate(link);
    setNotifOpen(false);
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-30">
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md p-1.5 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-1.5 text-[13px] min-w-0">
          {crumbs.length === 0 ? (
            <span className="text-slate-800 font-medium">Overview</span>
          ) : (
            crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && <span className="text-slate-300">/</span>}
                {crumb.path ? (
                  <Link to={crumb.path} className="text-slate-500 hover:text-navy-700 transition-colors truncate">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-800 font-medium truncate">{crumb.label}</span>
                )}
              </span>
            ))
          )}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-slate-500 hover:text-slate-700 transition-colors group"
        >
          <Search className="w-4 h-4" />
          <span className="hidden md:inline text-[12px] text-slate-400">Search projects, tenders, contractors...</span>
          <span className="hidden md:inline-flex items-center gap-0.5 px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-400 font-medium">
            <Command className="w-3 h-3" />K
          </span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md p-2 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-slate-200 rounded-lg shadow-dropdown animate-slide-up z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-[13px] font-semibold text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-navy-600 hover:text-navy-800 font-medium">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotifClick(n.link)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 text-left transition-colors"
                  >
                    <span
                      className={cn(
                        'mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0',
                        n.type === 'risk' && 'bg-red-500',
                        n.type === 'update' && 'bg-navy-500',
                        n.type === 'contractor' && 'bg-amber-500',
                        n.type === 'document' && 'bg-orange-500'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-[12.5px]', n.read ? 'text-slate-500' : 'text-slate-800 font-medium')}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          className="hidden sm:flex text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md p-2 transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="w-4.5 h-4.5" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:bg-slate-100 rounded-md p-1 pr-2 transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-navy-700 flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0">
              DI
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[12px] font-medium text-slate-800 leading-none">Demo Investigator</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Investigation Desk</div>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-dropdown animate-slide-up z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="text-[13px] font-semibold text-slate-900">Demo Investigator</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Investigation Desk</div>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left">
                  <User className="w-4 h-4 text-slate-400" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Preferences
                </button>
                <Link to="/system-status" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left">
                  <Activity className="w-4 h-4 text-slate-400" />
                  System Status
                </Link>
                <div className="border-t border-slate-100 my-1" />
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors text-left">
                  <LogOut className="w-4 h-4 text-slate-400" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
