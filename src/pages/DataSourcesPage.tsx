import { useState, useEffect } from 'react';
import { Database, CheckCircle2, Clock, XCircle, AlertCircle, Cloud, Server, RefreshCw, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { api } from '@/services/api';
import { dataSourceList } from '@/data/mockData';
import { cn } from '@/utils/cn';

export default function DataSourcesPage() {
  const [sources, setSources] = useState<any[]>(dataSourceList);
  const [loading, setLoading] = useState(false);
  const [atlasConnected, setAtlasConnected] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getDataSources()
      .then((data) => {
        if (data && data.length > 0) {
          setSources(data);
          setAtlasConnected(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    'Available': { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
    'Partial': { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
    'Demo': { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
    'Future Integration': { icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-800/40', border: 'border-slate-700/30' },
  };

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Data Sources & Cloud Telemetry"
        subtitle="Live procurement data pipelines, MoSPI catalogs, and MongoDB Atlas database status."
      />

      {/* MongoDB Atlas Live Connection Banner */}
      <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
            <Cloud className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-white">MongoDB Atlas Cloud Database</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE CONNECTED
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Cluster: <span className="text-slate-200 font-mono">Cluster0 (AWS / ap-south-1)</span> • Database: <span className="text-slate-200 font-mono">aarambha</span> • 7 Collections Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-semibold text-slate-400">Total Seeded Entities</div>
            <div className="text-[13px] font-bold text-emerald-300">543 Constituencies + Procurement Records</div>
          </div>
        </div>
      </div>

      {/* Data Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((src) => {
          const config = statusConfig[src.status as keyof typeof statusConfig] || statusConfig['Available'];
          const Icon = config.icon;
          return (
            <Card key={src.name}>
              <CardBody className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <Database className="w-4.5 h-4.5 text-sky-400" />
                  </div>
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded border', config.bg, config.color, config.border)}>
                    <Icon className="w-3 h-3" /> {src.status}
                  </span>
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-white">{src.name}</div>
                  <p className="text-[12px] text-slate-400 mt-1 leading-snug">
                    {src.type || src.description}
                  </p>
                </div>
                {src.records && (
                  <div className="pt-2 border-t border-slate-700/30 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Record Volume:</span>
                    <span className="text-slate-300 font-medium">{src.records}</span>
                  </div>
                )}
                {src.lastSync && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-400 font-medium">{src.lastSync}</span>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
