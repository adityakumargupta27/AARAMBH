import { Database, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { dataSourceList } from '@/data/mockData';
import { cn } from '@/utils/cn';

export default function DataSourcesPage() {
  const statusConfig = {
    'Available': { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
    'Partial': { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
    'Demo': { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
    'Future Integration': { icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-800/40', border: 'border-slate-700/30' },
  };

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Data Sources" subtitle="Procurement data pipeline and source availability." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSourceList.map((src) => {
          const config = statusConfig[src.status as keyof typeof statusConfig] || statusConfig['Available'];
          const Icon = config.icon;
          return (
            <Card key={src.name}>
              <CardBody>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 rounded-md bg-sky-500/10 flex items-center justify-center">
                    <Database className="w-4.5 h-4.5 text-sky-400" />
                  </div>
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded border', config.bg, config.color, config.border)}>
                    <Icon className="w-3 h-3" /> {src.status}
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-white">{src.name}</div>
                <p className="text-[12px] text-slate-500 mt-1 leading-snug">{src.description}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
