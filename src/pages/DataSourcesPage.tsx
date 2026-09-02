import { Database, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { dataSourceList } from '@/data/mockData';
import { cn } from '@/utils/cn';

export default function DataSourcesPage() {
  const statusConfig = {
    'Available': { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'Partial': { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    'Demo': { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    'Future Integration': { icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
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
                  <div className="w-9 h-9 rounded-md bg-navy-50 flex items-center justify-center">
                    <Database className="w-4.5 h-4.5 text-navy-700" />
                  </div>
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded border', config.bg, config.color, config.border)}>
                    <Icon className="w-3 h-3" /> {src.status}
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-slate-900">{src.name}</div>
                <p className="text-[12px] text-slate-500 mt-1 leading-snug">{src.description}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
