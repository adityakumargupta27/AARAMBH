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
  constituencies: '543 Constituencies',
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
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-30"
      style={{
        background: 'rgba(11, 17, 32, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
      }}
    >
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden text-slate-400 hover:text-white rounded-md p-1.5 transition-colors"
          style={{ background: 'transparent' }}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-1.5 text-[13px] min-w-0">
          {crumbs.length === 0 ? (
            <span className="text-white font-medium">Overview</span>
          ) : (
            crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && <span className="text-slate-600">/</span>}
                {crumb.path ? (
                  <Link to={crumb.path} className="text-slate-400 hover:text-sky-400 transition-colors truncate">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium truncate">{crumb.label}</span>
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
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all duration-200 group"
          style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
          <span className="hidden md:inline text-[12px] text-slate-500">Search projects, tenders, contractors...</span>
          <span className="hidden md:inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-medium"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#475569',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}
          >
            <Command className="w-3 h-3" />K
          </span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-slate-400 hover:text-white rounded-lg p-2 transition-all duration-200"
            style={{ background: 'transparent' }}
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full animate-breathe" />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-dropdown animate-slide-up z-50"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}
              >
                <span className="text-[13px] font-semibold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotifClick(n.link)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-200"
                    style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.04)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span
                      className={cn(
                        'mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0',
                        n.type === 'risk' && 'bg-red-400',
                        n.type === 'update' && 'bg-sky-400',
                        n.type === 'contractor' && 'bg-amber-400',
                        n.type === 'document' && 'bg-orange-400'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-[12.5px]', n.read ? 'text-slate-500' : 'text-slate-200 font-medium')}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          className="hidden sm:flex text-slate-400 hover:text-white rounded-lg p-2 transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="w-4.5 h-4.5" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-all duration-200"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(148, 163, 184, 0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
              }}
            >
              DI
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[12px] font-medium text-slate-200 leading-none">Demo Investigator</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Investigation Desk</div>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-500" />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-dropdown animate-slide-up z-50"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                <div className="text-[13px] font-semibold text-white">Demo Investigator</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Investigation Desk</div>
              </div>
              <div className="py-1">
                {[
                  { icon: User, label: 'Profile' },
                  { icon: Settings, label: 'Preferences' },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-300 hover:text-white transition-all text-left"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(148, 163, 184, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon className="w-4 h-4 text-slate-500" />
                    {label}
                  </button>
                ))}
                <Link
                  to="/system-status"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-300 hover:text-white transition-all text-left"
                >
                  <Activity className="w-4 h-4 text-slate-500" />
                  System Status
                </Link>
                <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)' }} className="my-1" />
                <button className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-300 hover:text-white transition-all text-left"
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(148, 163, 184, 0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
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
