import { Activity, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/Badge';
import { systemStatusList } from '@/data/mockData';
import { cn } from '@/utils/cn';

export default function SystemStatusPage() {
  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="System Status" subtitle="Platform health and operational status." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemStatusList.map((s) => {
          const isDemo = s.status === 'Demo Mode';
          const Icon = isDemo ? Clock : Activity;
          return (
            <Card key={s.name}>
              <CardBody className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0',
                      isDemo ? 'bg-amber-500/15 border border-amber-500/25' : 'bg-emerald-500/15 border border-emerald-500/25'
                    )}>
                      <Icon className={cn('w-4.5 h-4.5', isDemo ? 'text-amber-400' : 'text-emerald-400')} />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-white">{s.name}</div>
                      <div className="text-[12px] text-slate-400 mt-0.5">{s.detail}</div>
                    </div>
                  </div>
                  <StatusDot status={isDemo ? 'demo' : 'operational'} label={s.status} />
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-[14px] font-medium text-slate-100">All systems operational</span>
            </div>
            <div className="text-[12px] text-slate-400">
              Last refresh: 03 Sep 2026, 06:42 IST
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
