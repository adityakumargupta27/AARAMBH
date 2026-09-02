import { ArrowDown, Database, CheckCircle2, GitBranch, BarChart3, AlertTriangle, Gauge, FileSearch, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { methodologyPipeline, methodologyWeights } from '@/data/mockData';
import { cn } from '@/utils/cn';

const pipelineIcons = [Database, CheckCircle2, GitBranch, BarChart3, AlertTriangle, Gauge, FileSearch, Search];

export default function MethodologyPage() {
  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader title="Methodology" subtitle="Risk detection and scoring methodology." />

      {/* Pipeline */}
      <Card>
        <CardHeader title="Detection Pipeline" subtitle="From raw procurement data to investigation cases" />
        <CardBody>
          <div className="flex items-stretch overflow-x-auto scrollbar-thin pb-2">
            {methodologyPipeline.map((stage, i) => {
              const Icon = pipelineIcons[i] || Database;
              return (
                <div key={stage.stage} className="flex items-stretch flex-shrink-0">
                  <div className="flex flex-col items-center w-32 text-center">
                    <div className="w-10 h-10 rounded-lg bg-navy-50 border border-navy-200 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-navy-700" />
                    </div>
                    <div className="text-[12px] font-semibold text-slate-800 mt-2">{stage.stage}</div>
                    <div className="text-[10px] text-slate-500 mt-1 leading-snug">{stage.description}</div>
                  </div>
                  {i < methodologyPipeline.length - 1 && (
                    <div className="flex items-center pt-5 px-1">
                      <ArrowDown className="w-4 h-4 text-slate-300 -rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Risk Score Weights */}
      <Card>
        <CardHeader title="Risk Score Composition" subtitle="Illustrative weights for anomaly signal categories" />
        <CardBody>
          <div className="space-y-3">
            {methodologyWeights.map((w) => (
              <div key={w.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-medium text-slate-700">{w.label}</span>
                  <span className="text-[13px] font-bold tabular-nums text-slate-900">{w.weight}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-navy-600 rounded-full transition-all duration-500" style={{ width: `${w.weight * 4}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-[11px] text-amber-800 font-medium">
              Illustrative MVP configuration — requires validation before production use.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Detect Anomalies', desc: 'Statistical deviation from peer benchmarks across multiple signal categories.' },
          { title: 'Show Evidence', desc: 'Every finding includes source traceability, confidence level and recommended verification.' },
          { title: 'Support Investigation', desc: 'Surfaces cases for human review. Does not replace human judgment or establish liability.' },
        ].map((p) => (
          <Card key={p.title}>
            <CardBody>
              <div className="text-[14px] font-semibold text-slate-900">{p.title}</div>
              <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
