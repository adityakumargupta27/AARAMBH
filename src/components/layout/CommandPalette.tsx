import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderKanban, FileText, PenTool, Users, Gauge, Bot, ArrowRight, LayoutDashboard, FileBarChart, Landmark } from 'lucide-react';
import { cn } from '@/utils/cn';
import { mockProjects, mockTenders, mockContracts, mockContractors, mockInvestigationCases } from '@/data/mockData';
import { officialMPAllocations } from '@/data/officialMpladsData';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  label: string;
  type: 'Project' | 'Tender' | 'Contract' | 'Contractor' | 'Investigation' | 'Constituency';
  path: string;
  meta: string;
}

interface CommandItem {
  id: string;
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const commands: CommandItem[] = [
  { id: 'cmd-overview', label: 'Go to Overview', path: '/overview', icon: LayoutDashboard },
  { id: 'cmd-constituencies', label: 'Go to 543 Constituencies Registry', path: '/constituencies', icon: Landmark },
  { id: 'cmd-projects', label: 'Go to Projects', path: '/projects', icon: FolderKanban },
  { id: 'cmd-risk', label: 'Go to Risk Explorer', path: '/risk', icon: Gauge },
  { id: 'cmd-investigations', label: 'Go to Investigation Center', path: '/investigations', icon: Search },
  { id: 'cmd-ai', label: 'Go to AI Investigator', path: '/ai-investigator', icon: Bot },
  { id: 'cmd-reports', label: 'Go to Reports', path: '/reports', icon: FileBarChart },
];


export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  const searchResults: SearchResult[] = [];

  if (query.trim()) {
    const q = query.toLowerCase();
    mockProjects.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) {
        searchResults.push({ id: p.id, label: p.name, type: 'Project', path: `/projects/${p.id}`, meta: p.id });
      }
    });
    mockTenders.forEach((t) => {
      if (t.id.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q)) {
        searchResults.push({ id: t.id, label: `${t.id} — ${t.projectName}`, type: 'Tender', path: `/tenders/${t.id}`, meta: t.projectName });
      }
    });
    mockContracts.forEach((c) => {
      if (c.id.toLowerCase().includes(q) || c.projectName.toLowerCase().includes(q)) {
        searchResults.push({ id: c.id, label: `${c.id} — ${c.projectName}`, type: 'Contract', path: `/contracts/${c.id}`, meta: c.contractorName });
      }
    });
    mockContractors.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) {
        searchResults.push({ id: c.id, label: c.name, type: 'Contractor', path: `/contractors/${c.id}`, meta: c.id });
      }
    });
    mockInvestigationCases.forEach((c) => {
      if (c.id.toLowerCase().includes(q) || c.projectName.toLowerCase().includes(q)) {
        searchResults.push({ id: c.id, label: `${c.id} — ${c.projectName}`, type: 'Investigation', path: `/investigations/${c.id}`, meta: c.contractorName });
      }
    });
    officialMPAllocations.forEach((m) => {
      if (m.constituency.toLowerCase().includes(q) || m.mpName.toLowerCase().includes(q)) {
        searchResults.push({
          id: `MP-${m.srNo}`,
          label: `${m.constituency} (Hon. ${m.mpName})`,
          type: 'Constituency',
          path: `/constituencies`,
          meta: `${m.state} · ₹${(m.allocatedAmount / 10000000).toFixed(2)} Cr`,
        });
      }
    });
  }


  const matchingCommands = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const allItems = [...matchingCommands.map(c => ({ ...c, kind: 'command' as const })), ...searchResults.map(s => ({ ...s, kind: 'result' as const }))];
  const totalItems = allItems.length;

  const grouped = searchResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = allItems[selectedIndex];
      if (item) {
        navigate(item.path);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const typeIcons = {
    Project: FolderKanban,
    Tender: FileText,
    Contract: PenTool,
    Contractor: Users,
    Investigation: Gauge,
  };

  let currentIndex = 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4 animate-fade-in">
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(0, 0, 0, 0.6)' }} onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-xl shadow-modal animate-slide-up"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
          <Search className="w-4.5 h-4.5 text-slate-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, tenders, contractors... or type a command"
            className="flex-1 text-[14px] text-white placeholder-slate-500 bg-transparent outline-none"
          />
          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ background: 'rgba(30, 41, 59, 0.6)', color: '#64748b', border: '1px solid rgba(148, 163, 184, 0.1)' }}
          >ESC</span>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto scrollbar-thin py-2">
          {totalItems === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-[13px] text-slate-500">No results for "{query}"</p>
            </div>
          )}

          {/* Commands */}
          {matchingCommands.length > 0 && (
            <div className="mb-2">
              <div className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Commands</div>
              {matchingCommands.map((cmd) => {
                const idx = currentIndex++;
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => { navigate(cmd.path); onClose(); }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors',
                      selectedIndex === idx ? 'bg-sky-500/10' : ''
                    )}
                  >
                    <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="flex-1 text-[13px] text-slate-300">{cmd.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Search results grouped */}
          {Object.entries(grouped).map(([type, results]) => (
            <div key={type} className="mb-2">
              <div className="px-4 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{type}</div>
              {results.map((r) => {
                const idx = currentIndex++;
                const Icon = typeIcons[r.type as keyof typeof typeIcons] || FolderKanban;
                return (
                  <button
                    key={r.id}
                    onClick={() => { navigate(r.path); onClose(); }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors',
                      selectedIndex === idx ? 'bg-sky-500/10' : ''
                    )}
                  >
                    <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-slate-200 truncate">{r.label}</div>
                      <div className="text-[11px] text-slate-400 truncate">{r.meta}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                      style={{ background: 'rgba(30, 41, 59, 0.6)', color: '#64748b', border: '1px solid rgba(148, 163, 184, 0.1)' }}
                    >{r.type}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
